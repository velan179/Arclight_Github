'use strict';
/**
 * Tool: policy.evaluate
 * Evaluates return/replacement/refund eligibility based on policy rules.
 * Purely deterministic — no LLM involvement.
 */

const Policy = require('../models/Policy');

/**
 * @param {Object} params
 * @param {string} params.category — e.g. 'DAMAGED', 'RETURN', 'CANCELLATION', 'WARRANTY'
 * @param {string|Date} params.purchaseDate
 * @param {string} [params.customerId]
 * @param {string} [params.customerTier]
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ category, purchaseDate, customerId, customerTier }) {
  try {
    const policy = await Policy.findOne({ category });

    if (!policy) {
      return {
        tool: 'policy.evaluate',
        status: 'FAILURE',
        data: null,
        summary: `No policy found for category: ${category}`,
        errorCode: 'NOT_FOUND'
      };
    }

    const now = new Date();
    const purchase = new Date(purchaseDate);
    const daysSincePurchase = Math.floor((now - purchase) / (1000 * 60 * 60 * 24));
    const withinWindow = daysSincePurchase <= policy.returnWindowDays;

    // VIP customers get extended window
    const effectiveWindow = customerTier === 'VIP'
      ? policy.returnWindowDays + 15
      : policy.returnWindowDays;
    const effectiveWithinWindow = daysSincePurchase <= effectiveWindow;

    const flags = [];
    if (!effectiveWithinWindow) flags.push('RETURN_WINDOW_EXPIRED');
    if (!policy.replacementAllowed) flags.push('REPLACEMENT_NOT_ALLOWED');
    if (!policy.refundAllowed) flags.push('REFUND_NOT_ALLOWED');

    return {
      tool: 'policy.evaluate',
      status: 'SUCCESS',
      data: {
        policyId: policy.policyId,
        name: policy.name,
        category: policy.category,
        returnWindowDays: effectiveWindow,
        daysSincePurchase,
        withinReturnWindow: effectiveWithinWindow,
        replacementAllowed: policy.replacementAllowed && effectiveWithinWindow,
        refundAllowed: policy.refundAllowed && effectiveWithinWindow,
        requiresEvidence: policy.requiresEvidence,
        customerTier: customerTier || 'STANDARD'
      },
      summary: effectiveWithinWindow
        ? `Policy "${policy.name}": within return window (${daysSincePurchase}/${effectiveWindow} days). Replacement: ${policy.replacementAllowed}, Refund: ${policy.refundAllowed}`
        : `Policy "${policy.name}": RETURN WINDOW EXPIRED (${daysSincePurchase} days, limit ${effectiveWindow})`,
      flags
    };
  } catch (err) {
    return {
      tool: 'policy.evaluate',
      status: 'FAILURE',
      data: null,
      summary: `Error evaluating policy: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'policy.evaluate', execute };
