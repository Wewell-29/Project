require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  
const authRoutes = require('./routes/authRoutes');
const salesRoutes = require('./routes/salesRoutes');
const expenseRoutes = require('./routes/expenseRoutes'); 
const revenueRoutes = require('./routes/revenueRoutes'); 

const app = express();


const PORT = process.env.PORT;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes); 
app.use('/api/expenses', expenseRoutes); 
app.use('/api/revenue', revenueRoutes);  

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
