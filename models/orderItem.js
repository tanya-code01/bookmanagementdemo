const mongoose = require('mongoose')

const objectId = mongoose.Schema.ObjectId // Alias for ObjectId type

// Schema for a single item in an order
const orderItemSchema = new mongoose.Schema({
    product: {
        type: objectId, // Reference to a product (can be expanded with `ref`)
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Timestamp when the item is added
    }
})

module.exports = orderItemSchema; // Export as schema (not model)
