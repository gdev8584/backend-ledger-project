const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user using JWT

async function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.header.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token is missing.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
}

module.exports = { authenticateToken };