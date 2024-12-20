// controllers/salesController.js
const Sale = require('../models/Sale');

// Fetch all sales
exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find();
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Add a new sale
exports.addSale = async (req, res) => {
    const { haircut, date, price } = req.body;

    if (!haircut || !date || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newSale = new Sale({ haircut, date, price }); // Order No auto-assigned
        const savedSale = await newSale.save();
        res.status(201).json(savedSale);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
