// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    orderNo: { 
        type: Number, 
        unique: true 
    },
    haircut: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
});


const counterSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true },
    seq: { 
        type: Number, 
        default: 1 },
});

const Counter = mongoose.model('Counter', counterSchema);


saleSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'saleOrder' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true } 
        );
        this.orderNo = counter.seq; 
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Sale', saleSchema);
