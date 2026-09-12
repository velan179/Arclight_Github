const { test, describe, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const { executeRefund, executeReplacement, executeCancellation } = require('../actionsService');
const { simulateReplacementInventoryDrop, resetInventory } = require('../failureSimulator');
const Order = require('../../../models/Order');
const Action = require('../../../models/Action');
const Inventory = require('../../../models/Inventory');

describe('Actions Submodule Tests', () => {
  beforeEach(() => {
    mock.restoreAll();
    mock.method(Action.prototype, 'save', async function() { return this; });
  });

  test('Test 1 — Successful refund', async () => {
    const mockOrder = { orderId: 'ord_1', status: 'DELIVERED', amount: 50, save: mock.fn() };
    mock.method(Action, 'findOne', async () => null);
    mock.method(Order, 'findOne', async () => mockOrder);

    const res = await executeRefund('case_1', 'ord_1', 50, 'key_1', 'Refund reason');
    
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.type, 'REFUND');
    assert.strictEqual(mockOrder.status, 'REFUNDED');
    assert.strictEqual(mockOrder.save.mock.calls.length, 1);
  });

  test('Test 2 — Duplicate refund', async () => {
    const existingAction = { actionId: 'act_1', type: 'REFUND', status: 'COMPLETED' };
    mock.method(Action, 'findOne', async () => existingAction);
    const orderMock = mock.method(Order, 'findOne', async () => ({}));

    const res = await executeRefund('case_1', 'ord_1', 50, 'key_1', 'Refund reason');
    
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.actionId, 'act_1');
    assert.strictEqual(orderMock.mock.calls.length, 0);
  });

  test('Test 3 — Successful replacement', async () => {
    const mockOrder = { orderId: 'ord_2', status: 'DELIVERED', save: mock.fn(), markModified: mock.fn() };
    const mockInventory = { stockLevel: 1, save: mock.fn() };
    
    mock.method(Action, 'findOne', async () => null);
    mock.method(Order, 'findOne', async () => mockOrder);
    mock.method(Inventory, 'findOne', async () => mockInventory);

    const res = await executeReplacement('case_2', 'ord_2', 'prod_1', 'key_2');

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.type, 'REPLACEMENT');
    assert.strictEqual(mockInventory.stockLevel, 0);
    assert.strictEqual(mockOrder.markModified.mock.calls.length, 1);
    assert.strictEqual(mockOrder.save.mock.calls.length, 1);
    assert.strictEqual(mockInventory.save.mock.calls.length, 1);
  });

  test('Test 4 — Replacement unavailable', async () => {
    const mockOrder = { orderId: 'ord_3', status: 'DELIVERED', save: mock.fn(), markModified: mock.fn() };
    const mockInventory = { stockLevel: 0, save: mock.fn() };
    
    mock.method(Action, 'findOne', async () => null);
    mock.method(Order, 'findOne', async () => mockOrder);
    mock.method(Inventory, 'findOne', async () => mockInventory);

    const res = await executeReplacement('case_3', 'ord_3', 'prod_2', 'key_3');

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.code, 'REPLACEMENT_UNAVAILABLE');
    assert.strictEqual(mockInventory.save.mock.calls.length, 0);
    assert.strictEqual(mockOrder.save.mock.calls.length, 0);
  });

  test('Test 5 — Successful cancellation', async () => {
    const mockOrder = { orderId: 'ord_4', status: 'PLACED', save: mock.fn() };
    mock.method(Action, 'findOne', async () => null);
    mock.method(Order, 'findOne', async () => mockOrder);

    const res = await executeCancellation('case_4', 'ord_4', 'key_4', 'changed mind');

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.type, 'CANCELLATION');
    assert.strictEqual(mockOrder.status, 'CANCELLED');
    assert.strictEqual(mockOrder.save.mock.calls.length, 1);
  });

  test('Test 6 — Duplicate cancellation', async () => {
    const existingAction = { actionId: 'act_2', type: 'CANCELLATION', status: 'COMPLETED' };
    mock.method(Action, 'findOne', async () => existingAction);
    const orderMock = mock.method(Order, 'findOne', async () => ({}));

    const res = await executeCancellation('case_4', 'ord_4', 'key_4', 'changed mind');

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.actionId, 'act_2');
    assert.strictEqual(orderMock.mock.calls.length, 0);
  });

  test('Test 7 — Invalid state for cancellation', async () => {
    const mockOrder = { orderId: 'ord_5', status: 'SHIPPED', save: mock.fn() };
    mock.method(Action, 'findOne', async () => null);
    mock.method(Order, 'findOne', async () => mockOrder);

    const res = await executeCancellation('case_5', 'ord_5', 'key_5', 'changed mind');

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.code, 'STATE_CONFLICT');
    assert.strictEqual(mockOrder.status, 'SHIPPED');
    assert.strictEqual(mockOrder.save.mock.calls.length, 0);
  });

  test('Test 8 — Full PS5 failure scenario', async () => {
    const mockOrder = { orderId: 'ord_6', status: 'DELIVERED', save: mock.fn(), markModified: mock.fn() };
    const mockInventory = { productId: 'prod_ps5', stockLevel: 1, isSimulatedFailure: false, save: mock.fn() };
    
    mock.method(Action, 'findOne', async () => null);
    mock.method(Order, 'findOne', async () => mockOrder);
    mock.method(Inventory, 'findOne', async () => mockInventory);
    
    // Agent checks inventory (imagined check via mock inventory)
    assert.strictEqual(mockInventory.stockLevel, 1);
    
    // Simulate failure
    await simulateReplacementInventoryDrop('prod_ps5');
    assert.strictEqual(mockInventory.stockLevel, 0);
    assert.strictEqual(mockInventory.isSimulatedFailure, true);

    // Execute replacement
    const res = await executeReplacement('case_6', 'ord_6', 'prod_ps5', 'key_6');

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.code, 'REPLACEMENT_UNAVAILABLE');
    assert.strictEqual(mockOrder.save.mock.calls.length, 0);
  });
  
  test('Missing order returns NOT_FOUND', async () => {
    mock.method(Action, 'findOne', async () => null);
    mock.method(Order, 'findOne', async () => null);

    const res = await executeRefund('case_1', 'nonexistent', 50, 'key_1', 'Reason');
    
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.code, 'NOT_FOUND');
  });
});
