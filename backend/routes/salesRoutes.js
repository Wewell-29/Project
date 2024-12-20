// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// GET: Fetch all sales
router.get('/', salesController.getSales);

// POST: Add a new sale
router.post('/', salesController.addSale);

// DELETE: Delete a sale
router.delete('/:id', salesController.deleteSale);

module.exports = router;
