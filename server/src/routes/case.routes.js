const express = require('express');
const router = express.Router();
const caseController = require('../controllers/case.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { createCaseSchema } = require('../validators');

router.post('/', auth, validate(createCaseSchema), caseController.createCase);
router.get('/', auth, caseController.listCases);
router.get('/:id', auth, caseController.getCaseById);

module.exports = router;
