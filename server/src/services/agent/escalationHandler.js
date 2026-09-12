'use strict';
/**
 * escalationHandler.js — Member 2
 *
 * Produces a structured escalation record when the agent cannot
 * autonomously resolve the case.
 *
 * Escalates ONLY when:
 *  - No safe, permitted action exists (all candidates failed or disqualified)
 *  - Required information is missing and cannot be retrieved
 *  - Policy prohibits ALL autonomous actions
 *  - Account is suspended / verification permanently fails
 *  - Maximum iteration limit reached
 */

/**
 * Build a structured escalation payload.
 *
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} params.runId
 * @param {Object} params.goal
 * @param {Object} params.state
 * @param {string} params.reason — Human-readable escalation reason
 * @param {string} params.triggerType — What caused escalation
 * @param {Array}  [params.failedActions]
 * @param {number} [params.iterationsUsed]
 * @returns {Object} Structured escalation record
 */
function buildEscalation({ caseId, runId, goal, state, reason, triggerType, failedActions = [], iterationsUsed = 0 }) {
  const escalationId = `esc_${caseId}_${Date.now()}`;

  return {
    escalationId,
    caseId,
    runId,
    triggerType,
    reason,
    summary: `Autonomous resolution blocked: ${reason}`,
    context: {
      intent: goal?.intent,
      requestedResolution: goal?.requestedResolution,
      customerTier: state?.customer?.tier || 'UNKNOWN',
      orderId: state?.orderId,
      failedActions,
      iterationsUsed,
      policyStatus: state?.policy
        ? `Within window: ${state.policy.withinReturnWindow}, Replacement: ${state.policy.replacementAllowed}, Refund: ${state.policy.refundAllowed}`
        : 'Policy not evaluated',
      inventoryStatus: state?.inventory
        ? `Available: ${state.inventory.availableStock}`
        : 'Inventory not checked'
    },
    suggestedAction: _suggestHumanAction(triggerType, state, goal),
    createdAt: new Date().toISOString()
  };
}

/**
 * Internal: suggest a next step for the human agent.
 */
function _suggestHumanAction(triggerType, state, goal) {
  const suggestions = {
    POLICY_VIOLATION:       'Review policy exception eligibility and approve manually if warranted',
    ACCOUNT_SUSPENDED:      'Verify account suspension reason and determine eligibility for exception',
    MAX_ITERATIONS_REACHED: 'Review agent loop transcript and manually determine next resolution step',
    NO_VIABLE_ALTERNATIVE:  'All automated resolution paths exhausted — manual approval required',
    VERIFICATION_FAILURE:   'Verify database state manually; rollback or complete action as appropriate',
    MISSING_INFORMATION:    'Collect required information from customer and re-initiate agent run'
  };
  return suggestions[triggerType] || 'Manual review required';
}

module.exports = { buildEscalation };
