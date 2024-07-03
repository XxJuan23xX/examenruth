// src/routes/orderRoutes.js

const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { createOrder, getOrderHistory, getOrdersForAdmin } = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', authenticateJWT, createOrder);
router.get('/orders/history', authenticateJWT, getOrderHistory); // Verifica esta línea
router.get('/admin/orders', authenticateJWT, getOrdersForAdmin);


module.exports = router;
