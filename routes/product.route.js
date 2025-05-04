const express = require('express')
const { getAllBooks, getBookByTitle, createBook, updateBook, deleteBook } = require("../controllers/product.controller")
const auth = require('../middlewares/auth.middleware') // Auth middleware
const admin = require('../middlewares/admin.middleware') // Admin check middleware

let productRouter = express.Router() // Create product router

productRouter.get('/', getAllBooks); // Get all books
productRouter.get('/:title', getBookByTitle); // Get book by title

productRouter.put('/', auth, admin, createBook); // Add a new book (admin only)
productRouter.patch('/:title', auth, admin, updateBook); // Update a book by title (admin only)
productRouter.delete('/:title', auth, admin, deleteBook); // Delete a book by title (admin only)

module.exports = productRouter; // Export router
