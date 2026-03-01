const accountModel = require('../models/account.model');

// Create a new account for a user
const createAccountController = async (req, res) => {
    try {
        const userId = req.user._id;

        const newAccount = await accountModel.create({
            user: userId
        });

        res.status(201).json(newAccount);
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Server error while creating account' });
    }
};

module.exports = {
    createAccountController
};