import policyService from '../services/policy/policyService.js';
import { sendSuccess, errors } from '../utils/response.js';

export const policyController = {
  async getAll(req, res) {
    try {
      const policies = await policyService.getAll();
      return sendSuccess(res, { policies });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async checkEligibility(req, res) {
    try {
      const { actionType, customerTier, daysSinceDelivery, amount } = req.body;
      const evaluation = await policyService.checkEligibility({
        actionType: actionType || 'REPLACEMENT',
        customerTier: customerTier || 'vip',
        daysSinceDelivery: daysSinceDelivery || 4,
        amount: amount || 1299.99,
      });
      return sendSuccess(res, { evaluation });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default policyController;
