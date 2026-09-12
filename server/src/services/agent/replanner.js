'use strict';
/**
 * replanner.js — Member 2
 *
 * Handles autonomous recovery when the initial action fails.
 * Does NOT hardcode "if replacement fails then refund".
 * Instead it:
 *   1. Records the failed action
 *   2. Re-observes current state
 *   3. Calls planner.plan() with the updated failedActions set
 *   4. Returns the new candidate plan
 *
 * The refund is selected only because it is the highest-scoring
 * eligible candidate given the evidence — not because it's hardcoded.
 */

const { plan } = require('./planner');

/**
 * Generate an alternative plan after a failure.
 *
 * @param {Object} goal — Parsed goal
 * @param {Object} state — Accumulated observations
 * @param {string} failedAction — The action type that just failed (e.g. 'REPLACEMENT')
 * @param {Set<string>} previousFailedActions — Accumulation from prior replan cycles
 * @returns {{ selected: string|null, candidates: Array, rationale: string, requiresEscalation: boolean }}
 */
function replan(goal, state, failedAction, previousFailedActions = new Set()) {
  // Add the newly failed action to the exclusion set
  const updatedFailedActions = new Set(previousFailedActions);
  updatedFailedActions.add(failedAction);

  // Re-run the planner with the updated evidence and exclusions
  const newPlan = plan(goal, state, updatedFailedActions);

  return {
    ...newPlan,
    replanReason: `${failedAction} failed — evaluating alternatives`,
    failedActions: Array.from(updatedFailedActions)
  };
}

module.exports = { replan };
