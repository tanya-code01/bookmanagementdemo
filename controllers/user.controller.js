const bcypt = require('bcryptjs');  // Import bcrypt for password hashing and verification
const jwt = require('jsonwebtoken');  // Import JSON Web Token for generating authentication tokens
const User = require('../models/user.model');  // Import the User model for interacting with the user collection
const { validationResult } = require('express-validator');  // Import validationResult to handle validation errors

// Function to generate a JWT token with an expiration time of 1 day
const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Signup function to register a new user
const signup = async (req, res) => {
    try {
        // Check for validation errors from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { name, email, password, phone, isAdmin } = req.body;  // Extract data from request body

        // Check if the user already exists by searching for the email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

        // Create a new user with the provided data
        const newUser = new User({
            name,
            email,
            password,
            phone,
            isAdmin: isAdmin || false  // Default isAdmin to false if not provided
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with a success message
        res.status(200).json({ success: true, message: `${name} signed up successfully` });
    } catch (err) {
        // If there's an error, respond with the error message
        res.status(400).json({ success: false, message: err.message });
    }
}

// Signin function to authenticate a user
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;  // Extract email and password from request body

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid email" });

        // Check if the password matches
        if (!(await user.matchPassword(password))) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Respond with success message, token, and user details
        res.status(200).json({
            success: true,
            message: "User sign-in successful",
            token: token,
            userDetails: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        // If there's an error, respond with the error message
        res.status(400).json({ success: false, message: err.message });
    }
}

// Function to fetch all users excluding their passwords
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');  // Exclude the password field
        res.status(200).json({ success: true, message: "All users fetched successfully", data: users });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Function to fetch a specific user by their ID
const getUserByID = async (req, res) => {
    try {
        // Find the user by their ID from the route parameter
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        // Respond with the user data
        res.status(200).json({ success: true, message: "User fetched successfully", data: user });
    } catch (err) {
        // If there's an error, respond with the error message
        res.status(400).json({ success: false, message: err.message });
    }
}

// Function to delete a user by their ID
const deleteUser = async (req, res) => {
    try {
        // Find the user by their ID and delete
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        // Respond with success message
        res.status(200).json({ success: true, message: "User deleted successfully", data: user });
    } catch (err) {
        // If there's an error, respond with the error message
        res.status(400).json({ success: false, message: err.message });
    }
}

// Function to update a user's details
const updateUser = async (req, res) => {
    try {
        // Find the user by their ID
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        // Update user fields with the provided data
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.phone) user.phone = req.body.phone;

        // Save the updated user
        await user.save();

        // Respond with a success message
        res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (err) {
        // If there's an error, respond with the error message
        res.status(400).json({ success: false, message: err.message });
    }
}

// Export all controller functions to be used in routes
module.exports = {
    signin,
    signup,
    getAllUsers,
    getUserByID,
    updateUser,
    deleteUser
};
