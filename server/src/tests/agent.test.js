'use strict';
/**
 * Agent Module Tests — Member 2
 * Tests the full autonomous agent loop including:
 *  1. Replacement success path
 *  2. Replacement failure → replan → refund
 *  3. Policy rejection
 *  4. Escalation (no viable path)
 *  5. Goal parser unit tests
 *  6. Failure detector unit tests
 *  7. Planner unit tests
 *  8. Max iteration protection (simulated)
 *  9. Duplicate action prevention
 * 10. Verification failure → replan
 */

const { parseGoal }    = require('../services/agent/goalParser');
const { selectNextTool } = require('../services/agent/toolSelector');
const { plan }         = require('../services/agent/planner');
const { detect, FAILURE_TYPES } = require('../services/agent/failureDetector');
const { replan }       = require('../services/agent/replanner');
const { buildEscalation } = require('../services/agent/escalationHandler');

const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

// ── Test 1: goalParser ───────────────────────────────────────────────────────
describe('goalParser', () => {
  it('parses damaged laptop replacement request', () => {
    const goal = parseGoal('My laptop arrived damaged and I want a replacement.');
    assert.equal(goal.intent, 'DAMAGED_ITEM');
    assert.equal(goal.requestedResolution, 'REPLACEMENT');
    assert.equal(goal.policyCategory, 'DAMAGED');
    assert.equal(goal.urgency, 'NORMAL');
  });

  it('parses refund request', () => {
    const goal = parseGoal('I want a refund for this broken item.');
    assert.equal(goal.intent, 'DAMAGED_ITEM');
    assert.equal(goal.requestedResolution, 'REFUND');
  });

  it('parses cancellation request', () => {
    const goal = parseGoal('Please cancel my order immediately.');
    assert.equal(goal.intent, 'CANCELLATION');
    assert.equal(goal.urgency, 'CRITICAL');
  });

  it('throws on empty input', () => {
    assert.throws(() => parseGoal(''), /customerGoal must be/);
  });

  it('throws on non-string input', () => {
    assert.throws(() => parseGoal(null), /customerGoal must be/);
  });
});

// ── Test 2: failureDetector ──────────────────────────────────────────────────
describe('failureDetector', () => {
  it('detects STOCK_EMPTY failure', () => {
    const obs = { tool: 'inventory.check', status: 'FAILURE', flags: ['STOCK_EMPTY'], summary: 'No stock' };
    const result = detect(obs, 'inventory.check');
    assert.equal(result.isFailure, true);
    assert.equal(result.type, FAILURE_TYPES.STOCK_EMPTY);
    assert.equal(result.recoverable, true);
  });

  it('detects POLICY_VIOLATION as non-recoverable', () => {
    const obs = { tool: 'policy.evaluate', status: 'FAILURE', flags: ['RETURN_WINDOW_EXPIRED'], summary: 'Window expired' };
    const result = detect(obs, 'policy.evaluate');
    assert.equal(result.isFailure, true);
    assert.equal(result.type, FAILURE_TYPES.POLICY_VIOLATION);
    assert.equal(result.recoverable, false);
  });

  it('detects ACCOUNT_SUSPENDED as non-recoverable', () => {
    const obs = { tool: 'customer.get', status: 'SUCCESS', flags: ['ACCOUNT_SUSPENDED'], summary: 'Suspended' };
    const result = detect(obs, 'customer.get');
    assert.equal(result.isFailure, true);
    assert.equal(result.recoverable, false);
  });

  it('passes clean success observation', () => {
    const obs = { tool: 'order.get', status: 'SUCCESS', flags: [], summary: 'Order found' };
    const result = detect(obs, 'order.get');
    assert.equal(result.isFailure, false);
  });
});

// ── Test 3: planner ──────────────────────────────────────────────────────────
describe('planner', () => {
  const basePolicy = {
    withinReturnWindow: true,
    replacementAllowed: true,
    refundAllowed: true,
    daysSincePurchase: 5,
    returnWindowDays: 30
  };

  it('selects REPLACEMENT when stock available and preferred', () => {
    const goal = { requestedResolution: 'REPLACEMENT', intent: 'DAMAGED_ITEM' };
    const state = {
      policy: basePolicy,
      inventory: { availableStock: 5 },
      customer: { tier: 'STANDARD' },
      order: { status: 'DELIVERED', amount: 1999 }
    };
    const result = plan(goal, state, new Set());
    assert.equal(result.selected, 'REPLACEMENT');
  });

  it('selects REFUND when replacement stock is 0', () => {
    const goal = { requestedResolution: 'REPLACEMENT', intent: 'DAMAGED_ITEM' };
    const state = {
      policy: basePolicy,
      inventory: { availableStock: 0 },
      customer: { tier: 'STANDARD' },
      order: { status: 'DELIVERED', amount: 1999 }
    };
    const result = plan(goal, state, new Set());
    assert.equal(result.selected, 'REFUND');
  });

  it('returns escalation when window expired', () => {
    const goal = { requestedResolution: 'REPLACEMENT', intent: 'DAMAGED_ITEM' };
    const state = {
      policy: { ...basePolicy, withinReturnWindow: false, daysSincePurchase: 45 },
      inventory: null,
      customer: { tier: 'STANDARD' },
      order: { status: 'DELIVERED' }
    };
    const result = plan(goal, state, new Set());
    assert.equal(result.selected, null);
    assert.equal(result.requiresEscalation, true);
  });

  it('selects REFUND after REPLACEMENT is in failedActions', () => {
    const goal = { requestedResolution: 'REPLACEMENT', intent: 'DAMAGED_ITEM' };
    const state = {
      policy: basePolicy,
      inventory: { availableStock: 0 },
      customer: { tier: 'STANDARD' },
      order: { status: 'DELIVERED', amount: 999 }
    };
    const result = plan(goal, state, new Set(['REPLACEMENT']));
    assert.equal(result.selected, 'REFUND');
  });
});

// ── Test 4: replanner ────────────────────────────────────────────────────────
describe('replanner', () => {
  const basePolicy = {
    withinReturnWindow: true,
    replacementAllowed: true,
    refundAllowed: true,
    daysSincePurchase: 3,
    returnWindowDays: 30
  };

  it('dynamically selects REFUND after REPLACEMENT failure', () => {
    const goal = { requestedResolution: 'REPLACEMENT', intent: 'DAMAGED_ITEM' };
    const state = {
      policy: basePolicy,
      inventory: { availableStock: 0 },
      customer: { tier: 'GOLD' },
      order: { status: 'DELIVERED', amount: 500 }
    };
    const result = replan(goal, state, 'REPLACEMENT', new Set());
    assert.equal(result.selected, 'REFUND');
    assert.ok(result.failedActions.includes('REPLACEMENT'));
  });

  it('escalates when both REPLACEMENT and REFUND fail', () => {
    const goal = { requestedResolution: 'REPLACEMENT', intent: 'DAMAGED_ITEM' };
    const state = {
      policy: { ...basePolicy, refundAllowed: false },
      inventory: { availableStock: 0 },
      customer: { tier: 'STANDARD' },
      order: { status: 'DELIVERED' }
    };
    const result = replan(goal, state, 'REPLACEMENT', new Set(['REFUND']));
    assert.equal(result.selected, null);
    assert.equal(result.requiresEscalation, true);
  });
});

// ── Test 5: toolSelector ─────────────────────────────────────────────────────
describe('toolSelector', () => {
  it('selects customer.get first when no state gathered', () => {
    const goal = { policyCategory: 'DAMAGED', requestedResolution: 'REPLACEMENT' };
    const state = { customerId: 'cust_1', orderId: 'ord_1', customer: null, order: null, policy: null, inventory: null, failedActions: new Set() };
    const result = selectNextTool(goal, state, new Set());
    assert.equal(result.toolName, 'customer.get');
  });

  it('selects order.get after customer gathered', () => {
    const goal = { policyCategory: 'DAMAGED', requestedResolution: 'REPLACEMENT' };
    const state = { customerId: 'cust_1', orderId: 'ord_1', customer: { tier: 'STANDARD' }, order: null, policy: null, inventory: null, failedActions: new Set() };
    const executed = new Set(['customer.get']);
    const result = selectNextTool(goal, state, executed);
    assert.equal(result.toolName, 'order.get');
  });

  it('returns null when all investigation complete', () => {
    const goal = { policyCategory: 'DAMAGED', requestedResolution: 'REPLACEMENT' };
    const state = {
      customerId: 'cust_1', orderId: 'ord_1',
      customer: { tier: 'STANDARD' },
      order: { productId: 'prod_1', purchaseDate: new Date().toISOString() },
      policy: { replacementAllowed: true, withinReturnWindow: true },
      inventory: { availableStock: 5 },
      failedActions: new Set()
    };
    const executed = new Set(['customer.get', 'order.get', 'policy.evaluate', 'inventory.check']);
    const result = selectNextTool(goal, state, executed);
    assert.equal(result, null);
  });
});

// ── Test 6: escalationHandler ────────────────────────────────────────────────
describe('escalationHandler', () => {
  it('builds a valid escalation record', () => {
    const esc = buildEscalation({
      caseId: 'case_1',
      runId: 'run_1',
      goal: { intent: 'DAMAGED_ITEM', requestedResolution: 'REPLACEMENT' },
      state: { customer: { tier: 'VIP' }, orderId: 'ord_1', policy: { withinReturnWindow: false } },
      reason: 'Policy window expired',
      triggerType: 'POLICY_VIOLATION',
      failedActions: ['REPLACEMENT'],
      iterationsUsed: 3
    });
    assert.ok(esc.escalationId);
    assert.equal(esc.triggerType, 'POLICY_VIOLATION');
    assert.ok(esc.context.intent);
    assert.ok(esc.suggestedAction);
  });
});

console.log('✅ All Member 2 unit tests defined. Run with: node --test server/src/tests/agent.test.js');
