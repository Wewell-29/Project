require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // DB connection configuration
const authRoutes = require('./routes/authRoutes');
const salesRoutes = require('./routes/salesRoutes');  // Sales routes

const app = express();

// Ensure the PORT is set correctly
const PORT = process.env.PORT;

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);  // Attach sales routes

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
