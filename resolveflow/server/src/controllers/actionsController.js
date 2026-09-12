import actionsService from '../services/actions/actionsService.js';
import { sendSuccess, errors } from '../utils/response.js';

export const actionsController = {
  async refund(req, res) {
    try {
      const { caseId, runId, orderId, amount, reason, idempotencyKey } = req.body;
      const key = idempotencyKey || req.headers['idempotency-key'] || `IDEMP-REF-${Date.now()}`;
      const result = await actionsService.executeRefund({
        caseId: caseId || 'CASE-1001',
        runId: runId || `RUN-${Date.now()}`,
        orderId: orderId || 'ORD-88219',
        amount: amount || 1299.99,
        reason,
        idempotencyKey: key,
      });
      return sendSuccess(res, result, result.summary);
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async replacement(req, res) {
    try {
      const { caseId, runId, orderId, productId, idempotencyKey } = req.body;
      const key = idempotencyKey || req.headers['idempotency-key'] || `IDEMP-REP-${Date.now()}`;
      const result = await actionsService.executeReplacement({
        caseId: caseId || 'CASE-1001',
        runId: runId || `RUN-${Date.now()}`,
        orderId: orderId || 'ORD-88219',
        productId: productId || 'PROD-LAPTOP-X1',
        idempotencyKey: key,
      });
      return sendSuccess(res, result, result.summary || 'Replacement executed');
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async cancel(req, res) {
    try {
      const { caseId, runId, orderId, idempotencyKey } = req.body;
      const key = idempotencyKey || req.headers['idempotency-key'] || `IDEMP-CAN-${Date.now()}`;
      const result = await actionsService.executeCancellation({
        caseId: caseId || 'CASE-1001',
        runId: runId || `RUN-${Date.now()}`,
        orderId: orderId || 'ORD-88219',
        idempotencyKey: key,
      });
      return sendSuccess(res, result, result.summary);
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default actionsController;
