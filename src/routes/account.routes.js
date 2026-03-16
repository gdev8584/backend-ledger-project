const express = require('express');
const router = express.Router();

/**
 * post /api/accounts
 * Create a new account for the authenticated user
 * Request body: { status: 'ACTIVE' | 'FROZEN' | 'CLOSED', currency: string }
 * Response: 201 Created with account details or appropriate error message
 */

const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware.authenticateToken, accountController.createAccountController);

/**
 * get /api/accounts
 * Retrieve all accounts for the authenticated user
 * Response: 200 OK with list of accounts or appropriate error message
 */
router.get('/', authMiddleware.authenticateToken, accountController.getUserAccountsController);

/**
 * Get /api/accounts/balance/:accountId
 * Retrieve the balance for a specific account
 * Response: 200 OK with account balance or appropriate error message
 */
router.get('/balance/:accountId', authMiddleware.authenticateToken, accountController.getAccountBalanceController);

module.exports = router;