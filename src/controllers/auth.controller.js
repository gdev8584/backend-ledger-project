const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
require('dotenv').config();

// Register a new user

const registerUserController = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !name || !password) {
            return res.status(400).json({ 
                status: 'failed',
                message: 'Email, name, and password are required' 
            });
        }
       const normalizedEmail = email.trim().toLowerCase();
        // Check if user already exists
        let user = await userModel.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(422).json({ 
                status: 'failed',
                message: 'Email already exists' 
            });
        }
        // Create new user
        user = new userModel({ email: normalizedEmail, name, password });
        await user.save();
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        res.cookie('token', token);

        res.status(201).json({ 
            status: 'success',
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
        // Send registration email
        await emailService.sendRegistrationEmail(user.email, user.name);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ status: 'failed', message: 'Email already exists' });
        }
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ status: 'failed', message: error.message });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ status: 'failed', message: 'Server error' });
    }
}

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'failed', message: 'Email and password are required' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    try {
        let user = await userModel.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ status: 'failed', message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ status: 'failed', message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.cookie('token', token);
        res.status(200).json({ status: 'success', message: 'Login successful', token, user: { id: user._id, email: user.email, name: user.name }});
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ status: 'failed', message: 'Server error' });
    }
}

module.exports = {
    registerUserController,
    loginUserController
};