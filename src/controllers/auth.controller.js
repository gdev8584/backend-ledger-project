const userModel = require('../models/user.model');
require('dotenv').config();

// Register a new user

const registerUserController = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !name || !password) {
            return res.status(400).json({ message: 'Email, name, and password are required' });
        }
       const normalizedEmail = email.trim().toLowerCase();
        // Check if user already exists
        let user = await userModel.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Create new user
        user = new userModel({ email: normalizedEmail, name, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    try {
        let user = await userModel.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful'});
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    registerUserController,
    loginUserController
};