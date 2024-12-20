require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // Your DB connection configuration
const authRoutes = require('./routes/authRoutes');  // Your authentication routes

const app = express();

// Ensure the PORT is set correctly, even if leading zeros are used
const PORT = process.env.PORT || 70;  // Default to 70 if PORT is not found

// CORS configuration
const corsOptions = {
  origin: '*',  // Allow all origins during development (or set this to specific origin if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));  // Enable CORS with the specified options
app.use(express.json());     // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);  // Attach authentication routes

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
