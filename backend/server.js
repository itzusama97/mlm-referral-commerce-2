// This is the main server file that brings everything together.
const mongoose = require("mongoose")
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Required for frontend-backend communication

// Import both user and transaction routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const addBalanceRoutes = require("./routes/addBalanceRoutes");


// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// Use CORS middleware to allow requests from your frontend
app.use(cors());

// Body parser middleware to handle JSON data
app.use(express.json());

// Main API routes
// The server will use these routes to handle incoming requests
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/add-balance", addBalanceRoutes);


// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in mode on port ${PORT}`);
});

