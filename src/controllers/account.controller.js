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

// Get all accounts for the authenticated user
const getUserAccountsController = async (req, res) => {
    try {
        const userId = req.user._id;

        const accounts = await accountModel.find({ user: userId });

        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'Server error while fetching accounts' });
    }
}

// Get the balance for a specific account
const getAccountBalanceController = async (req, res) => {
    try {
        const accountId = req.params.accountId;

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        })

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            })
        }

        // Ensure the account belongs to the authenticated user
        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this account' });
        }

        const balance = await account.getBalance();

        res.status(200).json({ balance });
    } catch (error) {
        console.error('Error fetching account balance:', error);
        res.status(500).json({ message: 'Server error while fetching account balance' });
    }
}

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
};  