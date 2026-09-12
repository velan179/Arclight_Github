const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verification.controller');
const auth = require('../middleware/auth');

router.post('/:runId', auth, verificationController.verifyRun);
router.get('/:runId', auth, verificationController.getVerificationByRunId);

module.exports = router;
