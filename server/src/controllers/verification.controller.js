const { successResponse } = require('../utils/response');
const verificationService = require('../services/verification');

const verificationController = {
  verifyRun: async (req, res, next) => {
    try {
      const { runId } = req.params;
      const result = await verificationService.verifyRun(runId);
      return successResponse(res, result, 'State verification completed', 200);
    } catch (error) {
      next(error);
    }
  },

  getVerificationByRunId: async (req, res, next) => {
    try {
      const { runId } = req.params;
      const result = await verificationService.getVerificationReport(runId);
      return successResponse(res, result, 'Verification report retrieved');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = verificationController;
