const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');

router.get('/:id', auth, orderController.getOrderById);

module.exports = router;
