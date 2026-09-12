const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const auth = require('../middleware/auth');

router.get('/:id', auth, customerController.getCustomerById);

module.exports = router;
