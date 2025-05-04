const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for each book item in the order
const orderItemSchema = new Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Book model
        ref: 'Book',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Minimum quantity is 1
    }
});

// Main order schema
const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    books: [orderItemSchema], // Array of ordered book items
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Pending' // Default order status
    },
    paymentStatus: {
        type: String,
        default: 'Pending' // Default payment status
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Order', orderSchema); // Export Order model
