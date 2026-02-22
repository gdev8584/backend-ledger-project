const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register a new user
router.post('/register', authController.registerUserController);
router.post('/login', authController.loginUserController);


module.exports = router;