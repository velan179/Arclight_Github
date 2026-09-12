const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const auth = require('../middleware/auth');

router.get('/:productId', auth, inventoryController.getInventoryByProductId);

module.exports = router;
