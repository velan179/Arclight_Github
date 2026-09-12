const express = require('express');
const router = express.Router();
const actionController = require('../controllers/action.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
  refundActionSchema,
  replacementActionSchema,
  cancelActionSchema
} = require('../validators');

router.post('/refund', auth, validate(refundActionSchema), actionController.refund);
router.post('/replacement', auth, validate(replacementActionSchema), actionController.replacement);
router.post('/cancel', auth, validate(cancelActionSchema), actionController.cancel);

module.exports = router;
