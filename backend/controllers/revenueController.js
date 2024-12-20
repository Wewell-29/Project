const Sale = require('../models/Sale');
const Expense = require('../models/Expense');

const getMonthlyRevenue = async (req, res) => {
  try {
    const { month } = req.query;

    const salesAggregate = [
      {
        $group: {
          _id: { $month: "$date" },
          totalSales: { $sum: "$price" }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const expensesAggregate = [
      {
        $group: {
          _id: { $month: "$date" },
          totalExpenses: { $sum: "$price" }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const salesData = await Sale.aggregate(salesAggregate);
    const expensesData = await Expense.aggregate(expensesAggregate);

    let revenueData = salesData.map(sale => {
      const expense = expensesData.find(exp => exp._id === sale._id);
      const revenue = sale.totalSales - (expense ? expense.totalExpenses : 0);
      return {
        month: sale._id,
        revenue: revenue
      };
    });

    expensesData.forEach(expense => {
      if (!revenueData.some(item => item.month === expense._id)) {
        const revenue = -expense.totalExpenses;
        revenueData.push({
          month: expense._id,
          revenue: revenue
        });
      }
    });

    if (month) {
      const filteredData = revenueData.filter(item => item.month === parseInt(month));

      if (filteredData.length === 0) {
        return res.status(404).json({ message: `No revenue data found for month ${month}` });
      }

      return res.json(filteredData);
    }

    revenueData.sort((a, b) => a.month - b.month);

    res.json(revenueData);
  } catch (error) {
    console.error("Error computing monthly revenue:", error);
    res.status(500).send("Server Error");
  }
};

const getDailyRevenue = async (req, res) => {
  try {
    const { month } = req.query; // Get the month from the query params

    if (!month) {
      return res.status(400).json({ message: 'Month is required' });
    }

    // Create aggregation pipeline to get daily sales data
    const salesAggregate = [
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$date" }, parseInt(month)] // Match only sales for the specified month
          }
        }
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" } }, // Group by day of the month
          totalSales: { $sum: "$price" }
        }
      },
      { $sort: { "_id.day": 1 } }
    ];

    // Create aggregation pipeline to get daily expense data
    const expensesAggregate = [
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$date" }, parseInt(month)] // Match only expenses for the specified month
          }
        }
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" } }, // Group by day of the month
          totalExpenses: { $sum: "$price" }
        }
      },
      { $sort: { "_id.day": 1 } }
    ];

    // Get sales and expenses data for the month
    const salesData = await Sale.aggregate(salesAggregate);
    const expensesData = await Expense.aggregate(expensesAggregate);

    // Merge sales and expenses data for each day
    let revenueData = salesData.map(sale => {
      const expense = expensesData.find(exp => exp._id.day === sale._id.day);
      const revenue = sale.totalSales - (expense ? expense.totalExpenses : 0);
      return {
        day: sale._id.day,
        revenue: revenue
      };
    });

    // Add days with no sales but with expenses
    expensesData.forEach(expense => {
      if (!revenueData.some(item => item.day === expense._id.day)) {
        const revenue = -expense.totalExpenses;
        revenueData.push({
          day: expense._id.day,
          revenue: revenue
        });
      }
    });

    // If month is provided, return the filtered data for that month
    res.json(revenueData);
  } catch (error) {
    console.error("Error computing daily revenue:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = { getMonthlyRevenue,
  getDailyRevenue };

