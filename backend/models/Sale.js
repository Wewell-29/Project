// models/Sale.js
const mongoose = require('mongoose');

// Schema for the sales
const saleSchema = new mongoose.Schema({
    orderNo: { type: Number, unique: true }, // Unique auto-generated Order No
    haircut: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
});

// Counter schema for managing sequential numbers
const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 1 },
});

const Counter = mongoose.model('Counter', counterSchema);

// Pre-save hook for auto-incrementing `Order No`
saleSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'saleOrder' }, // Counter name
            { $inc: { seq: 1 } },  // Increment sequence
            { new: true, upsert: true } // Create if not exist
        );
        this.orderNo = counter.seq; // Assign the sequence to orderNo
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Sale', saleSchema);
