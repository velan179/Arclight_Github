'use strict';
/**
 * Tool: verification.run
 * Independently verifies that all expected state changes occurred in the DB.
 * This is Member 2's verification bridge — Member 4 owns the full verification service.
 * This tool queries DB state and confirms consistency.
 */

const Verification = require('../models/Verification');
const Action = require('../models/Action');
const Order = require('../models/Order');

/**
 * @param {Object} params
 * @param {string} params.runId — AgentRun ObjectId string
 * @param {string} params.caseId
 * @param {string} params.expectedOutcome — 'REFUND' | 'REPLACEMENT' | 'CANCELLATION'
 * @param {string} params.orderId
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ runId, caseId, expectedOutcome, orderId }) {
  try {
    const checkedItems = [];
    let allVerified = true;

    // Check: Action record exists with COMPLETED status
    const action = await Action.findOne({
      runId,
      type: expectedOutcome,
      status: 'COMPLETED'
    });

    if (action) {
      checkedItems.push({ item: `${expectedOutcome} action record`, status: 'CONFIRMED', details: { actionId: action.actionId } });
    } else {
      checkedItems.push({ item: `${expectedOutcome} action record`, status: 'MISMATCH', details: { expected: 'COMPLETED', found: 'NONE' } });
      allVerified = false;
    }

    // Check: Order status matches expected outcome
    if (orderId) {
      const order = await Order.findOne({ orderId });
      const expectedOrderStatus = expectedOutcome === 'REFUND' ? 'REFUNDED' :
        expectedOutcome === 'CANCELLATION' ? 'CANCELLED' : 'DELIVERED';

      if (order && (order.status === expectedOrderStatus || expectedOutcome === 'REPLACEMENT')) {
        checkedItems.push({ item: 'Order status', status: 'CONFIRMED', details: { status: order.status } });
      } else {
        checkedItems.push({
          item: 'Order status',
          status: 'MISMATCH',
          details: { expected: expectedOrderStatus, found: order ? order.status : 'NOT_FOUND' }
        });
        allVerified = false;
      }
    }

    // Persist verification record (upsert by runId)
    const verificationRecord = await Verification.findOneAndUpdate(
      { runId },
      {
        runId,
        caseId,
        verified: allVerified,
        checkedItems,
        verifiedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return {
      tool: 'verification.run',
      status: 'SUCCESS',
      data: {
        runId,
        verified: allVerified,
        checkedItems,
        verifiedAt: verificationRecord.verifiedAt
      },
      summary: allVerified
        ? `Verification PASSED — all ${checkedItems.length} checks confirmed`
        : `Verification FAILED — ${checkedItems.filter(c => c.status !== 'CONFIRMED').length} mismatches detected`,
      flags: allVerified ? [] : ['VERIFICATION_FAILED']
    };
  } catch (err) {
    return {
      tool: 'verification.run',
      status: 'FAILURE',
      data: null,
      summary: `Verification execution failed: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'verification.run', execute };
