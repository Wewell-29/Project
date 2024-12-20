// controllers/expenseController.js
const Expense = require('../models/Expense');

const getNextOrderNo = async () => {
  const lastExpense = await Expense.findOne().sort({ orderNo: -1 });
  return lastExpense ? lastExpense.orderNo + 1 : 1;
};

const addExpense = async (req, res) => {
  try {
    const { item, quantity, date, price } = req.body;

    const orderNo = await getNextOrderNo();

    const newExpense = new Expense({
      orderNo,
      item,
      quantity,
      date,
      price
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: 'Error adding expense', error });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching expenses', error });
  }
};

module.exports = { addExpense, getExpenses };
