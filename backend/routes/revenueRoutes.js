
const express = require('express');
const router = express.Router();
const { getMonthlyRevenue,
        getDailyRevenue
 } = require('../controllers/revenueController');  // 

router.get('/', getMonthlyRevenue);
router.get('/daily-revenue', getDailyRevenue);

module.exports = router;
