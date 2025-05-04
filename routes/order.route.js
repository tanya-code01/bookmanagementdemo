const express = require('express');
const { createOrder, getAllOrders, getOrderById, getUserOrders, updateOrder, deleteOrder } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware'); // Auth middleware
const admin = require('../middlewares/admin.middleware'); // Admin check middleware

const orderRouter = express.Router(); // Create order router

orderRouter.post('/', auth, createOrder); // Create a new order (only for logged-in users)
orderRouter.get('/', admin, getAllOrders); // Get all orders (admin only)
orderRouter.get('/:id', auth, getOrderById);  // Get a specific order by ID (auth required)
orderRouter.get('/user/order', auth, getUserOrders);  // Get orders for the logged-in user
orderRouter.patch('/:id', auth, admin, updateOrder); // Update order (admin only)
orderRouter.delete('/:id', admin, deleteOrder); // Delete order (admin only)

module.exports = orderRouter; // Export router

