'use strict';
/**
 * planner.js — Member 2
 *
 * Determines the best resolution action given the current evidence.
 * This is NOT a hardcoded sequence — it scores resolution candidates
 * based on:
 *   - policy eligibility
 *   - inventory availability
 *   - customer preference (requestedResolution)
 *   - actions already failed (failedActions set)
 *   - customer tier priority
 *
 * Returns the ranked list of candidates and the selected primary action.
 */

/**
 * Build resolution candidates from current evidence and score each.
 *
 * @param {Object} goal — Parsed goal
 * @param {Object} state — Accumulated observations
 * @param {Set<string>} [failedActions] — Action types that have already failed
 * @returns {{ selected: string|null, candidates: Array, rationale: string }}
 */
function plan(goal, state, failedActions = new Set()) {
  const { policy, inventory, customer, order } = state;
  const candidates = [];

  // ── Guard: must have policy data ─────────────────────────────────────────
  if (!policy) {
    return {
      selected: null,
      candidates: [],
      rationale: 'Cannot plan without policy evaluation — investigation incomplete'
    };
  }

  if (!policy.withinReturnWindow) {
    return {
      selected: null,
      candidates: [],
      rationale: 'Return window expired — no autonomous resolution available',
      requiresEscalation: true,
      escalationReason: `Policy window expired: ${policy.daysSincePurchase} days since purchase (limit: ${policy.returnWindowDays})`
    };
  }

  // ── Score: REPLACEMENT ───────────────────────────────────────────────────
  if (policy.replacementAllowed && !failedActions.has('REPLACEMENT')) {
    const stockAvailable = inventory?.availableStock > 0;
    let score = 70; // Base score

    // Customer preference bonus
    if (goal.requestedResolution === 'REPLACEMENT') score += 20;

    // VIP customers prefer replacement
    if (customer?.tier === 'VIP') score += 10;

    // Stock unavailability kills the candidate
    if (inventory && !stockAvailable) {
      candidates.push({
        action: 'REPLACEMENT',
        score: 0,
        eligible: false,
        reason: 'Stock unavailable'
      });
    } else {
      candidates.push({
        action: 'REPLACEMENT',
        score,
        eligible: true,
        reason: stockAvailable
          ? `Replacement eligible — ${inventory?.availableStock ?? 'unknown'} units in stock`
          : 'Replacement eligible — stock not yet verified'
      });
    }
  }

  // ── Score: REFUND ────────────────────────────────────────────────────────
  if (policy.refundAllowed && !failedActions.has('REFUND')) {
    let score = 60; // Base score

    // Customer preference bonus
    if (goal.requestedResolution === 'REFUND') score += 20;

    // Fallback bonus when replacement has failed
    if (failedActions.has('REPLACEMENT')) score += 30;

    candidates.push({
      action: 'REFUND',
      score,
      eligible: true,
      reason: failedActions.has('REPLACEMENT')
        ? `Refund selected as fallback — replacement was unavailable`
        : `Refund eligible per policy`
    });
  }

  // ── Score: CANCELLATION ──────────────────────────────────────────────────
  // Only for non-delivered orders
  if (goal.intent === 'CANCELLATION' || goal.requestedResolution === 'CANCELLATION') {
    const orderStatus = order?.status;
    if (orderStatus && orderStatus !== 'DELIVERED' && !failedActions.has('CANCELLATION')) {
      candidates.push({
        action: 'CANCELLATION',
        score: 50,
        eligible: true,
        reason: 'Order not yet delivered — cancellation eligible'
      });
    }
  }

  // ── Select highest scoring eligible candidate ─────────────────────────────
  const eligible = candidates.filter(c => c.eligible).sort((a, b) => b.score - a.score);
  const selected = eligible.length > 0 ? eligible[0].action : null;
  const top = eligible[0];

  return {
    selected,
    candidates,
    rationale: selected
      ? `Selected ${selected}: ${top.reason} (score: ${top.score})`
      : 'No eligible resolution actions found — escalation required',
    requiresEscalation: !selected
  };
}

module.exports = { plan };
