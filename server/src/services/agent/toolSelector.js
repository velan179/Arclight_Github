'use strict';
/**
 * toolSelector.js — Member 2
 *
 * Determines the NEXT tool to call based on:
 *   - current goal
 *   - accumulated case state (observations gathered so far)
 *   - tools already executed in this run (prevent duplicates)
 *   - failure flags
 *
 * Returns a { toolName, params } object — never a random or hardcoded sequence.
 * Selection is driven entirely by what evidence is still missing or what state
 * has changed.
 */

// ── Phase definitions ────────────────────────────────────────────────────────
// Each phase checks whether its tool has been run and whether it's still needed.

/**
 * Determine the next tool invocation given the current run state.
 *
 * @param {Object} goal — Structured goal from goalParser
 * @param {Object} state — Accumulated observations { customer, order, policy, inventory, failedActions }
 * @param {Set<string>} executedTools — Tools already called this run
 * @param {Object} options
 * @param {boolean} [options.simulateFailure]
 * @returns {{ toolName: string, params: Object } | null} null = no more investigation needed
 */
function selectNextTool(goal, state, executedTools, options = {}) {
  const { simulateFailure = false } = options;

  // ── Phase 1: Gather customer data ────────────────────────────────────────
  if (!state.customer && !executedTools.has('customer.get')) {
    return {
      toolName: 'customer.get',
      params: { customerId: state.customerId },
      phase: 'INVESTIGATION',
      rationale: 'Customer profile required for eligibility and tier assessment'
    };
  }

  // ── Phase 2: Gather order data ───────────────────────────────────────────
  if (!state.order && !executedTools.has('order.get')) {
    return {
      toolName: 'order.get',
      params: { orderId: state.orderId },
      phase: 'INVESTIGATION',
      rationale: 'Order details required to confirm delivery and product info'
    };
  }

  // ── Phase 3: Evaluate policy ─────────────────────────────────────────────
  if (!state.policy && !executedTools.has('policy.evaluate')) {
    const purchaseDate = state.order?.purchaseDate || new Date().toISOString();
    return {
      toolName: 'policy.evaluate',
      params: {
        category: goal.policyCategory || 'DAMAGED',
        purchaseDate,
        customerTier: state.customer?.tier
      },
      phase: 'INVESTIGATION',
      rationale: 'Policy evaluation required before any resolution action'
    };
  }

  // ── Phase 4: Check inventory (only if replacement is a candidate) ─────────
  const replacementPossible = state.policy?.replacementAllowed && !state.failedActions?.has('REPLACEMENT');
  if (replacementPossible && !state.inventory && !executedTools.has('inventory.check')) {
    const productId = state.order?.productId;
    if (productId) {
      return {
        toolName: 'inventory.check',
        params: { productId, simulateFailure },
        phase: 'INVESTIGATION',
        rationale: 'Inventory check required to validate replacement availability'
      };
    }
  }

  // ── No more investigation needed ─────────────────────────────────────────
  return null;
}

module.exports = { selectNextTool };
