export const failureDetector = {
  detect(toolResult) {
    if (!toolResult) {
      return { isFailure: true, code: 'EMPTY_RESULT', message: 'Tool returned no response' };
    }

    if (toolResult.success === false) {
      return {
        isFailure: true,
        code: toolResult.error || 'ACTION_FAILED',
        message: toolResult.message || 'Operation did not succeed',
      };
    }

    if (toolResult.available === false || toolResult.stockQuantity === 0) {
      return {
        isFailure: true,
        code: 'INVENTORY_UNAVAILABLE',
        message: 'Replacement inventory stock is 0 across all warehouses.',
      };
    }

    if (toolResult.eligible === false) {
      return {
        isFailure: true,
        code: 'INELIGIBLE',
        message: toolResult.reason || 'Case does not meet enterprise eligibility criteria',
      };
    }

    return { isFailure: false };
  },
};

export default failureDetector;
