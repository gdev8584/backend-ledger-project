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

module.exports = router;