const express = require('express')
const { getUserByID } = require('../controllers/user.controller')
const { signin, signup, getAllUsers, updateUser, deleteUser } = require('../controllers/user.controller')
const auth = require('../middlewares/auth.middleware') // Auth middleware

const userRouter = express.Router() // Create user router

userRouter.post('/signup', signup) // Register a new user
userRouter.post('/signin', signin) // Login user and return token
userRouter.get('/:id', auth, getUserByID) // Get user by ID (auth required)
userRouter.patch('/:id', auth, updateUser)  // Update user info (auth required)
userRouter.delete('/:id', auth, deleteUser) // Delete user (auth required)
userRouter.get('/', auth, getAllUsers) // Get all users (auth required)

module.exports = userRouter; // Export router
