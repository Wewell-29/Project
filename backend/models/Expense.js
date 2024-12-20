// models/Expense.js
const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);

const expenseSchema = new mongoose.Schema({
  item: { 
    type: String, 
    required: true 
},
  quantity: { 
    type: Number, 
    required: true 
},
  date: { 
    type: Date, 
    required: true 
},
  price: { 
    type: Number, 
    required: true 
}
});

expenseSchema.plugin(mongooseSequence, { inc_field: 'orderNo' });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
