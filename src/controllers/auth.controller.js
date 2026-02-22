const userModel = require('../models/user.model');
require('dotenv').config();

// Register a new user

const registerUserController = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        // Check if user already exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Create new user
        user = new userModel({ email, name, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email }).select('+password');
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