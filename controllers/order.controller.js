const Book = require('../models/product.model'); // Import the Book model to fetch book details
const Order = require('../models/order.model'); // Import the Order model to save and manage orders

// Controller function to create an order
const createOrder = async (req, res) => {
    const { itemList, address, paymentMethod } = req.body; // Extract order details from request body
    const userId = req.id; // Get the user ID from the middleware (auth)
    
    try {
        // Extract book IDs from the itemList (array of books in the order)
        const bookIds = itemList.map(book => book.bookId);

        // Find the actual books in the database using the extracted book IDs
        const books = await Book.find({
            _id: { $in: bookIds } // Find books with matching IDs from the database
        });

        // Build the order details using the found books
        const orderDetailsList = itemList.map((item) => {
            const bookDetails = books.find(b => b._id.toString() === item.bookId);
            if (!bookDetails) {
                throw new Error("Book not found"); // If any book isn't found, throw an error
            }
            return {
                book: bookDetails._id, // Get the book's ObjectId
                quantity: item.quantity, // Get the quantity from the request
                price: bookDetails.price  // Get the price of the book from the database
            }
        });

        // Calculate the total order amount by multiplying price and quantity for each book
        const totalAmount = orderDetailsList.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Create a new Order document with all the required fields
        const order = new Order({
            user: userId,
            books: orderDetailsList,
            address: address,
            paymentMethod: paymentMethod,
            totalAmount: totalAmount // The calculated total amount for the order
        });

        // Save the order to the database
        const createdOrder = await order.save();

        // Respond with the successfully created order
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: createdOrder
        });
    } catch (err) {
        console.log("err", err); // Log the error to the console
        res.status(400).json({
            success: false,
            message: err.message // Send the error message back in the response
        });
    }
};

// Controller function to get all orders (admin-only access)
const getAllOrders = async (req, res) => {
    try {
        // Find all orders from the database
        const orders = await Order.find({});
        
        // Send the orders in the response
        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (err) {
        // Handle any errors
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to get orders for the logged-in user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.id; // Get the user ID from the middleware (auth)
        
        // Find orders that belong to the logged-in user
        const orders = await Order.find({
            user: userId // Match orders with the userId
        });

        // Respond with the user's orders
        return res.status(200).json({
            success: true,
            message: "User orders fetched successfully",
            data: orders
        });
    } catch (err) {
        // Handle any errors
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to update an order's status and payment status (admin-only access)
const updateOrder = async (req, res) => {
    const { status, paymentStatus } = req.body; // Get the new status and payment status from the request body
    const orderId = req.params.id; // Get the order ID from the route parameters
    
    try {
        // Check if the user is an admin (this is handled by admin middleware)
        if (!req.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Not authorized. Admin access required."
            });
        }

        // Find the order in the database by its ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Update the order's status and payment status if provided
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        // Save the updated order to the database
        await order.save();

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Order updated successfully"
        });
    } catch (err) {
        // Handle any errors
        console.log('Update Order Error:', err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to delete an order
const deleteOrder = async (req, res) => {
    const orderId = req.params.id; // Get the order ID from the route parameters
    
    try {
        // Find the order by its ID and delete it from the database
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) return res.status(404).json({
            success: false,
            message: "Order not found"
        });

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (err) {
        // Handle any errors
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Controller function to get a specific order by its ID (only for the user who owns it)
const getOrderById = async (req, res) => {
    const orderId = req.params.id; // Get the order ID from the route parameters
    
    try {
        // Find the order by its ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if the logged-in user is authorized to view the order
        if (order.user.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        // Respond with the order data
        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (err) {
        // Handle any errors
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Export all controller functions so they can be used in the routes
module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    updateOrder,
    deleteOrder,
    getOrderById
};
