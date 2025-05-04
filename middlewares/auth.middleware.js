const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const mongoose = require('mongoose');

const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(400).json({ success: false, message: "No token found" })

        // Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Find user by decoded ID
        const user = await User.findOne({ _id: decoded.id });
        console.log('Found user:', user);

        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        req.user = user; // Attach user to request
        req.isAdmin = user.isAdmin; // Attach isAdmin flag to request
        next(); // Proceed to next middleware/route
    }
    catch (err) {
        console.log('Auth Error:', err);
        res.status(400).json({ success: false, message: err.message })
    }
}

module.exports = authMiddleware; // Export middleware
