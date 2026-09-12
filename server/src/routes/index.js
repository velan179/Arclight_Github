const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const caseRoutes = require('./case.routes');
const agentRoutes = require('./agent.routes');
const customerRoutes = require('./customer.routes');
const orderRoutes = require('./order.routes');
const inventoryRoutes = require('./inventory.routes');
const policyRoutes = require('./policy.routes');
const actionRoutes = require('./action.routes');
const verificationRoutes = require('./verification.routes');

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/agent', agentRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/policies', policyRoutes);
router.use('/actions', actionRoutes);
router.use('/verification', verificationRoutes);

module.exports = router;
