const { successResponse } = require('../utils/response');
const agentService = require('../services/agent');

const agentController = {
  run: async (req, res, next) => {
    try {
      const { caseId, simulateFailure } = req.body;
      const result = await agentService.run(caseId, { simulateFailure });
      return successResponse(res, result, 'Agent execution initiated', 200);
    } catch (error) {
      next(error);
    }
  },

  getRunById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const run = await agentService.getRunById(id);
      return successResponse(res, run, 'Agent run status fetched');
    } catch (error) {
      next(error);
    }
  },

  getRunEvents: async (req, res, next) => {
    try {
      const { id } = req.params;
      // Default event stream for foundation verification & frontend testing
      const events = [
        {
          runId: id,
          type: 'GOAL_RECEIVED',
          timestamp: new Date(Date.now() - 4000).toISOString(),
          summary: 'Customer requested damaged laptop replacement',
          status: 'SUCCESS',
          metadata: {}
        },
        {
          runId: id,
          type: 'TOOL_EXECUTION',
          tool: 'inventory.check',
          timestamp: new Date(Date.now() - 3000).toISOString(),
          summary: 'Checked replacement stock for SKU-MBP-14',
          status: 'SUCCESS',
          metadata: { available: 0 }
        },
        {
          runId: id,
          type: 'FAILURE',
          timestamp: new Date(Date.now() - 2500).toISOString(),
          summary: 'Replacement stock unavailable',
          status: 'FAILURE',
          metadata: { error: 'STOCK_EMPTY' }
        },
        {
          runId: id,
          type: 'REPLAN',
          timestamp: new Date(Date.now() - 2000).toISOString(),
          summary: 'Initiated refund pathway as alternate recovery',
          status: 'SUCCESS',
          metadata: { alternative: 'REFUND' }
        },
        {
          runId: id,
          type: 'VERIFICATION',
          timestamp: new Date(Date.now() - 1000).toISOString(),
          summary: 'Verified refund credited to customer ledger',
          status: 'SUCCESS',
          metadata: { verified: true }
        },
        {
          runId: id,
          type: 'RESOLUTION',
          timestamp: new Date().toISOString(),
          summary: 'Case successfully resolved',
          status: 'SUCCESS',
          metadata: { finalOutcome: 'REFUND_COMPLETED' }
        }
      ];

      return successResponse(res, events, 'Agent run events fetched');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = agentController;
