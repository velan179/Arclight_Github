import orchestrator from '../services/agent/orchestrator.js';
import caseController from './caseController.js';
import Case from '../models/Case.js';
import { sendSuccess, sendError, errors } from '../utils/response.js';
import { getConnectionState } from '../config/db.js';

export const agentController = {
  async run(req, res) {
    try {
      const { caseId, customerId, orderId, goalText, chaosOptions } = req.body;

      let targetCaseId = caseId;
      let targetCustId = customerId || 'CUST-9001';
      let targetOrderId = orderId || 'ORD-88219';
      let targetGoal = goalText || 'My laptop arrived damaged. I want a replacement.';

      // If caseId provided, load case details
      if (caseId) {
        const { isConnected } = getConnectionState();
        if (isConnected) {
          const c = await Case.findOne({ caseId });
          if (c) {
            targetCustId = c.customerId;
            targetOrderId = c.orderId;
            targetGoal = c.customerGoal;
          }
        }
      } else {
        targetCaseId = 'CASE-1001';
      }

      // Execute agent run asynchronously or synchronously
      // For instant response to client, we can return the initiated run, or await and return complete timeline
      // Awaiting gives client instant complete timeline
      const result = await orchestrator.executeRun({
        caseId: targetCaseId,
        customerId: targetCustId,
        orderId: targetOrderId,
        goalText: targetGoal,
        chaosOptions: chaosOptions || {},
      });

      return sendSuccess(res, result, 'Agent run executed successfully');
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async getRunById(req, res) {
    try {
      const { id } = req.params;
      const run = orchestrator.getRun(id);
      if (!run) return errors.notFound(res, `Agent run ${id}`);
      return sendSuccess(res, { run });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async getRunEvents(req, res) {
    try {
      const { id } = req.params;
      const events = orchestrator.getEvents(id);
      return sendSuccess(res, { events, count: events.length });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default agentController;
