const express = require('express');
const connectDB = require('./config/dbConnection');

// Connect to MongoDB
connectDB();

const app = express();


module.exports = app;