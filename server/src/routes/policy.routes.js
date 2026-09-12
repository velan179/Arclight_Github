const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy.controller');
const auth = require('../middleware/auth');

router.get('/', auth, policyController.getPolicies);

module.exports = router;
