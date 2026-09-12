export const replanner = {
  replan({ originalGoal, failure, observations }) {
    // If replacement failed due to inventory stockout:
    if (failure.code === 'INVENTORY_UNAVAILABLE' || originalGoal.intent === 'REPLACEMENT') {
      return {
        viable: true,
        alternativeAction: 'REFUND',
        rationale: 'Primary replacement failed due to 0 warehouse inventory. Evaluated fallback to full financial refund.',
        nextStep: 'VERIFY_REFUND_POLICY',
        summary: 'Adaptive Re-plan: Replacement stock exhausted. Switching resolution strategy to full 100% refund.',
      };
    }

    // If refund failed
    if (failure.code === 'GATEWAY_TIMEOUT' || failure.code === 'REFUND_FAILED') {
      return {
        viable: true,
        alternativeAction: 'STORE_CREDIT_OR_RETRY',
        rationale: 'Gateway timed out. Fallback to store credit voucher or human supervisor queue.',
        nextStep: 'ESCALATE',
        summary: 'Adaptive Re-plan: Electronic payment failure. Escalating to human queue for manual override.',
      };
    }

    return {
      viable: false,
      reason: 'No automated secondary resolution path exists for this failure condition.',
      summary: 'Autonomous recovery exhausted. Handing off to human supervisor.',
    };
  },
};

export default replanner;
