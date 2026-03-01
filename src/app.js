const express = require('express');
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Welcome to the Ledger API');
});

/* Routes */
const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);


module.exports = app;