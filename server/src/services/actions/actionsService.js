const Order = require('../../models/Order');
const Action = require('../../models/Action');
const Inventory = require('../../models/Inventory');
const { checkExistingAction } = require('./idempotency');

const executeRefund = async (caseId, orderId, amount, idempotencyKey, reason) => {
  const existingAction = await checkExistingAction(idempotencyKey);
  if (existingAction) {
    return {
      success: true,
      data: {
        actionId: existingAction.actionId,
        type: existingAction.type,
        status: existingAction.status,
        amount: existingAction.amount,
        timestamp: existingAction.timestamp
      },
      message: "Refund already processed"
    };
  }

  const order = await Order.findOne({ orderId });
  if (!order) {
    return { success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } };
  }

  if (order.status === 'REFUNDED') {
    return { success: false, error: { code: 'STATE_CONFLICT', message: 'Order already refunded' } };
  }
  if (order.status === 'CANCELLED') {
    return { success: false, error: { code: 'STATE_CONFLICT', message: 'Order is cancelled' } };
  }

  order.status = 'REFUNDED';
  await order.save();

  const actionId = `act_ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const action = new Action({
    actionId,
    caseId,
    type: 'REFUND',
    status: 'COMPLETED',
    amount: amount || order.amount,
    idempotencyKey: idempotencyKey || undefined,
    details: { reason }
  });
  await action.save();

  return {
    success: true,
    data: {
      actionId: action.actionId,
      type: action.type,
      status: action.status,
      amount: action.amount,
      timestamp: action.timestamp
    },
    message: "Refund processed successfully"
  };
};

const executeReplacement = async (caseId, orderId, productId, idempotencyKey) => {
  const existingAction = await checkExistingAction(idempotencyKey);
  if (existingAction) {
    return {
      success: true,
      data: {
        actionId: existingAction.actionId,
        type: existingAction.type,
        status: existingAction.status,
        timestamp: existingAction.timestamp
      },
      message: "Replacement already processed"
    };
  }

  const order = await Order.findOne({ orderId });
  if (!order) {
    return { success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } };
  }

  if (order.status === 'REFUNDED' || order.status === 'CANCELLED') {
    return { success: false, error: { code: 'STATE_CONFLICT', message: 'Order cannot be replaced in current state' } };
  }

  // Inventory is checked again here because the agent's earlier
  // observation may be stale when execution begins.
  const inventory = await Inventory.findOne({ productId });
  if (!inventory || inventory.stockLevel <= 0) {
    return {
      success: false,
      error: {
        code: 'REPLACEMENT_UNAVAILABLE',
        message: 'Replacement inventory is unavailable'
      }
    };
  }

  inventory.stockLevel -= 1;
  await inventory.save();

  order.markModified('updatedAt'); 
  await order.save();

  const actionId = `act_rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const action = new Action({
    actionId,
    caseId,
    type: 'REPLACEMENT',
    status: 'COMPLETED',
    idempotencyKey: idempotencyKey || undefined
  });
  await action.save();

  return {
    success: true,
    data: {
      actionId: action.actionId,
      type: action.type,
      status: action.status,
      timestamp: action.timestamp
    },
    message: "Replacement processed successfully"
  };
};

const executeCancellation = async (caseId, orderId, idempotencyKey, reason) => {
  const existingAction = await checkExistingAction(idempotencyKey);
  if (existingAction) {
    return {
      success: true,
      data: {
        actionId: existingAction.actionId,
        type: existingAction.type,
        status: existingAction.status,
        timestamp: existingAction.timestamp
      },
      message: "Cancellation already processed"
    };
  }

  const order = await Order.findOne({ orderId });
  if (!order) {
    return { success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } };
  }

  if (order.status === 'CANCELLED') {
    return { success: false, error: { code: 'STATE_CONFLICT', message: 'Order is already cancelled' } };
  }

  if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
    return { success: false, error: { code: 'STATE_CONFLICT', message: 'Cannot cancel an order that has been shipped or delivered' } };
  }

  order.status = 'CANCELLED';
  await order.save();

  const actionId = `act_can_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const action = new Action({
    actionId,
    caseId,
    type: 'CANCELLATION',
    status: 'COMPLETED',
    idempotencyKey: idempotencyKey || undefined,
    details: { reason }
  });
  await action.save();

  return {
    success: true,
    data: {
      actionId: action.actionId,
      type: action.type,
      status: action.status,
      timestamp: action.timestamp
    },
    message: "Cancellation processed successfully"
  };
};

module.exports = {
  executeRefund,
  executeReplacement,
  executeCancellation
};
