import customerService from '../services/customer/customerService.js';
import { sendSuccess, errors } from '../utils/response.js';

export const customerController = {
  async getById(req, res) {
    try {
      const { id } = req.params;
      const customer = await customerService.getById(id);
      if (!customer) return errors.notFound(res, `Customer ${id}`);
      return sendSuccess(res, { customer });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default customerController;
