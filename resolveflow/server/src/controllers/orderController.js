import orderService from '../services/order/orderService.js';
import { sendSuccess, errors } from '../utils/response.js';

export const orderController = {
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getById(id);
      if (!order) return errors.notFound(res, `Order ${id}`);
      return sendSuccess(res, { order });
    } catch (err) {
      return errors.internal(res, err.message);
    }
  },
};

export default orderController;
