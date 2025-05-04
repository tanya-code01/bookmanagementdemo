require('dotenv').config() // Loads environment variables from .env file

const express = require('express') // Import express framework
const mongoose = require('mongoose'); // Import mongoose for MongoDB interaction

const productRouter = require('./routes/product.route'); // Product-related routes
const userRouter = require('./routes/user.route'); // User-related routes
const orderRouter = require('./routes/order.route'); // Order-related routes
const cors = require('cors')

const app = express() // Initialize express app
const PORT = process.env.PORT || 3000; // Set port from env or default to 3000

app.use(cors())

app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/demo2')
.then(()=> console.log('mongodb connected successfully')) // Log on success
.catch(err => {
    console.log('error connecting to mongodb : ', err) // Log on failure
})

// Register routers with base paths
app.use("/books", productRouter)
app.use("/user", userRouter)
app.use("/order", orderRouter)

// Test root endpoint
app.get('/', (req,res) => {
    res.send("ok")
})

// Start the server
app.listen(PORT,() =>{
    console.log(`server listening at ${PORT}`)
})
