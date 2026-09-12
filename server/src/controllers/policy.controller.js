const { successResponse } = require('../utils/response');
const policyService = require('../services/policy');

const policyController = {
  getPolicies: async (req, res, next) => {
    try {
      const policies = await policyService.getAllPolicies();
      return successResponse(res, policies, 'Policy list retrieved');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = policyController;
