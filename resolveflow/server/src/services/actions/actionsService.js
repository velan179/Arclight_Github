import Action from '../../models/Action.js';
import orderService from '../order/orderService.js';
import inventoryService from '../inventory/inventoryService.js';
import idempotencyManager from './idempotency.js';
import failureSimulator from './failureSimulator.js';
import { getConnectionState } from '../../config/db.js';

export const actionsService = {
  async executeRefund({ caseId, runId, orderId, amount, reason, idempotencyKey }) {
    // 1. Idempotency Check
    const cached = idempotencyManager.check(idempotencyKey);
    if (cached) {
      return { ...cached.result, idempotencyHit: true };
    }

    // 2. Chaos failure check
    if (failureSimulator.getFlags().actionExecutionError) {
      const failResult = {
        success: false,
        actionType: 'REFUND',
        error: 'GATEWAY_TIMEOUT',
        message: 'Payment gateway connection timed out during refund dispatch.',
      };
      return failResult;
    }

    // 3. Update order state
    await orderService.updateStatus(orderId, 'REFUNDED');

    const actionRecord = {
      actionId: `ACT-REFUND-${Date.now()}`,
      caseId,
      runId,
      type: 'REFUND',
      status: 'COMPLETED',
      idempotencyKey,
      amount: amount || 1299.99,
      currency: 'USD',
      details: {
        orderId,
        refundMethod: 'ORIGINAL_PAYMENT_METHOD',
        gatewayRef: `TXN-REF-${Math.floor(100000 + Math.random() * 900000)}`,
        reason: reason || 'Customer requested resolution due to defective item and inventory stockout',
      },
      executedAt: new Date(),
    };

    const { isConnected } = getConnectionState();
    if (isConnected) {
      try {
        await Action.create(actionRecord);
      } catch (err) {
        console.warn('Could not save Action document to Mongo:', err.message);
      }
    }

    const response = {
      success: true,
      actionId: actionRecord.actionId,
      type: 'REFUND',
      amount: actionRecord.amount,
      currency: 'USD',
      status: 'COMPLETED',
      summary: `Successfully executed $${actionRecord.amount} refund to original payment method (Ref: ${actionRecord.details.gatewayRef})`,
      details: actionRecord.details,
    };

    idempotencyManager.record(idempotencyKey, response);
    return response;
  },

  async executeReplacement({ caseId, runId, orderId, productId, idempotencyKey }) {
    const cached = idempotencyManager.check(idempotencyKey);
    if (cached) return { ...cached.result, idempotencyHit: true };

    // Check inventory availability (or chaos simulation)
    const availability = await inventoryService.checkAvailability(productId);
    if (!availability.available || availability.stockQuantity <= 0) {
      const failResult = {
        success: false,
        actionType: 'REPLACEMENT',
        error: 'INSUFFICIENT_INVENTORY',
        message: `Replacement order failed: Product ${productId} is out of stock across all fulfillment centers.`,
      };
      return failResult;
    }

    await orderService.updateStatus(orderId, 'REPLACED');

    const actionRecord = {
      actionId: `ACT-REPLACE-${Date.now()}`,
      caseId,
      runId,
      type: 'REPLACEMENT',
      status: 'COMPLETED',
      idempotencyKey,
      details: {
        orderId,
        productId,
        replacementOrderId: `ORD-REP-${Date.now()}`,
        trackingNumber: `1Z9999999999999999`,
      },
      executedAt: new Date(),
    };

    const { isConnected } = getConnectionState();
    if (isConnected) {
      try {
        await Action.create(actionRecord);
      } catch (err) {
        console.warn('Could not save Action document to Mongo:', err.message);
      }
    }

    const response = {
      success: true,
      actionId: actionRecord.actionId,
      type: 'REPLACEMENT',
      status: 'COMPLETED',
      summary: `Replacement order created (${actionRecord.details.replacementOrderId}) with priority expedited shipping.`,
      details: actionRecord.details,
    };

    idempotencyManager.record(idempotencyKey, response);
    return response;
  },

  async executeCancellation({ caseId, runId, orderId, idempotencyKey }) {
    const cached = idempotencyManager.check(idempotencyKey);
    if (cached) return { ...cached.result, idempotencyHit: true };

    await orderService.updateStatus(orderId, 'CANCELLED');

    const response = {
      success: true,
      actionId: `ACT-CANCEL-${Date.now()}`,
      type: 'CANCELLATION',
      status: 'COMPLETED',
      summary: `Order ${orderId} successfully cancelled and release hold removed.`,
    };

    idempotencyManager.record(idempotencyKey, response);
    return response;
  },
};

export default actionsService;
