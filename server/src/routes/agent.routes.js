const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { agentRunSchema } = require('../validators');

router.post('/run', auth, validate(agentRunSchema), agentController.run);
router.get('/runs/:id', auth, agentController.getRunById);
router.get('/runs/:id/events', auth, agentController.getRunEvents);

module.exports = router;
