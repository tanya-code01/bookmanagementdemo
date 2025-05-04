const User = require('../models/user.model')

const adminMiddleware = async (req, res, next) => {
    try {
        const user = req.user;  // Get user from previous auth middleware
        if (!user) return res.status(400).json({ success: false, message: "User not found" });
        if (!user.isAdmin) return res.status(403).json({ success: false, message: "Admin access required" });
        
        next(); // User is admin, continue
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

module.exports = adminMiddleware; // Export middleware
