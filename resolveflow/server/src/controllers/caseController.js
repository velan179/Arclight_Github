import Case from '../models/Case.js';
import { sendSuccess, sendError, errors } from '../utils/response.js';
import { getConnectionState } from '../config/db.js';

// In-memory cases fallback store
const fallbackCases = [
  {
    caseId: 'CASE-1001',
    customerId: 'CUST-9001',
    orderId: 'ORD-88219',
    customerGoal: 'My laptop arrived damaged. I want a replacement.',
    category: 'DAMAGED_ITEM',
    status: 'OPEN',
    priority: 'HIGH',
    evidence: {
      customerVerified: true,
      orderEligible: true,
      policyMatched: 'POL-REPLACE-01',
      inventoryChecked: false,
    },
    createdAt: new Date().toISOString(),
  },
];

export const caseController = {
  async list(req, res) {
    try {
      const { isConnected } = getConnectionState();
      if (isConnected) {
        const cases = await Case.find().sort({ createdAt: -1 });
        if (cases.length > 0) return sendSuccess(res, { cases });
      }
      return sendSuccess(res, { cases: fallbackCases });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { isConnected } = getConnectionState();
      if (isConnected) {
        const found = await Case.findOne({ caseId: id });
        if (found) return sendSuccess(res, { case: found });
      }
      const foundMock = fallbackCases.find((c) => c.caseId === id);
      if (foundMock) return sendSuccess(res, { case: foundMock });
      return errors.notFound(res, `Case ${id}`);
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async create(req, res) {
    try {
      const { customerId, orderId, customerGoal, category, priority } = req.body;
      if (!customerId || !orderId || !customerGoal) {
        return errors.validation(res, 'customerId, orderId and customerGoal are required');
      }

      const caseId = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCase = {
        caseId,
        customerId,
        orderId,
        customerGoal,
        category: category || 'DAMAGED_ITEM',
        priority: priority || 'MEDIUM',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      };

      const { isConnected } = getConnectionState();
      if (isConnected) {
        const created = await Case.create(newCase);
        return sendSuccess(res, { case: created }, 'Case created successfully', 201);
      }

      fallbackCases.unshift(newCase);
      return sendSuccess(res, { case: newCase }, 'Case created successfully', 201);
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default caseController;
