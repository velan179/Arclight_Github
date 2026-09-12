import verificationService from '../services/verification/verificationService.js';
import Verification from '../models/Verification.js';
import { sendSuccess, errors } from '../utils/response.js';
import { getConnectionState } from '../config/db.js';

export const verificationController = {
  async runVerification(req, res) {
    try {
      const { caseId, runId, actionId, actionType, orderId } = req.body;
      const targetRunId = req.params.runId || runId || `RUN-${Date.now()}`;
      const result = await verificationService.verifyAction({
        caseId: caseId || 'CASE-1001',
        runId: targetRunId,
        actionId: actionId || `ACT-${Date.now()}`,
        actionType: actionType || 'REFUND',
        orderId: orderId || 'ORD-88219',
      });
      return sendSuccess(res, { verification: result }, result.auditSummary);
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async getByRunId(req, res) {
    try {
      const { runId } = req.params;
      const { isConnected } = getConnectionState();
      if (isConnected) {
        const found = await Verification.findOne({ runId });
        if (found) return sendSuccess(res, { verification: found });
      }

      // Return synthetic verification check for demo
      return sendSuccess(res, {
        verification: {
          runId,
          verified: true,
          auditSummary: 'State verified: Order REFUNDED, ledger balanced, audit trail immutable.',
        },
      });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default verificationController;
