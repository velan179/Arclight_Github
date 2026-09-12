import inventoryService from '../services/inventory/inventoryService.js';
import failureSimulator from '../services/actions/failureSimulator.js';
import { sendSuccess, errors } from '../utils/response.js';

export const inventoryController = {
  async getAvailability(req, res) {
    try {
      const { id, productId } = req.params;
      const targetId = id || productId;
      const availability = await inventoryService.checkAvailability(targetId);
      return sendSuccess(res, { availability });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },

  async updateChaos(req, res) {
    try {
      const { inventoryOutage, actionExecutionError, verificationFailure } = req.body;
      if (inventoryOutage !== undefined) failureSimulator.setFlag('inventoryOutage', inventoryOutage);
      if (actionExecutionError !== undefined) failureSimulator.setFlag('actionExecutionError', actionExecutionError);
      if (verificationFailure !== undefined) failureSimulator.setFlag('verificationFailure', verificationFailure);
      return sendSuccess(res, { flags: failureSimulator.getFlags() }, 'Chaos flags updated');
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default inventoryController;
