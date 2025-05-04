const Book = require("../models/product.model"); // Import the Book model to interact with the books collection

// Controller function to fetch all books from the database
const getAllBooks = async (req, res) => {
    try {
        // Fetch all books from the database
        const books = await Book.find();
        // Respond with a success message and the list of books
        res.status(200).json({
            success: true,
            message: "All the books fetched successfully",
            data: books
        });
    } catch (err) {
        // Handle any errors and respond with the error message
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to fetch a book by its title
const getBookByTitle = async (req, res) => {
    try {
        // Find a book by its title from the route parameter
        const book = await Book.findOne({ title: req.params.title });
        
        // If the book is not found, return a "book not found" message
        if (!book) return res.status(404).json({
            success: false,
            message: "Book not found"
        });

        // Respond with the found book
        res.status(200).json({
            success: true,
            message: "Book fetched successfully",
            data: book
        });
    } catch (err) {
        // Handle any errors and respond with the error message
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to create a new book
const createBook = async (req, res) => {
    try {
        const { title, author, price, inStock } = req.body; // Extract data from the request body
        
        // Validate the price value to ensure it's a positive number
        if (!price || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid price value"
            });
        }

        // Create a new book instance with the provided data
        let newBook = new Book({
            title,
            author,
            price,
            inStock: inStock !== undefined ? inStock : true // Set inStock to true if not provided
        });

        // Save the new book to the database
        await newBook.save();

        // Respond with a success message and the created book data
        res.status(201).json({
            success: true,
            message: "New book created successfully",
            data: newBook
        });
    } catch (err) {
        // Handle any errors and respond with the error message
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to update an existing book by its title
const updateBook = async (req, res) => {
    try {
        // If the price is provided, validate that it's a positive number
        if (req.body.price && req.body.price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid price value"
            });
        }

        // Update the book by its title using the provided data
        const book = await Book.findOneAndUpdate(
            { title: req.params.title }, // Find the book by its title
            req.body, // Update the book with the new data
            { new: true, runValidators: true } // Ensure the updated document is returned and validation is run
        );

        // If the book is not found, return a "book not found" message
        if (!book) return res.status(404).json({
            success: false,
            message: "Book not found"
        });

        // Respond with a success message and the updated book data
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    } catch (err) {
        // Handle any errors and respond with the error message
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to delete a book by its title
const deleteBook = async (req, res) => {
    try {
        // Find the book by its title and delete it from the database
        const book = await Book.findOneAndDelete({ title: req.params.title });
        
        // If the book is not found, return a "book not found" message
        if (!book) return res.status(404).json({
            success: false,
            message: "Book not found"
        });

        // Respond with a success message
        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (err) {
        // Handle any errors and respond with the error message
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};

// Export all controller functions to be used in routes
module.exports = {
    getAllBooks,
    getBookByTitle,
    createBook,
    updateBook,
    deleteBook
};
