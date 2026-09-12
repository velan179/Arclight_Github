export const goalParser = {
  parse(text) {
    const lower = (text || '').toLowerCase();
    let requestedAction = 'REPLACEMENT';
    let urgency = 'MEDIUM';
    let reportedIssue = 'DEFECT';

    if (lower.includes('refund') || lower.includes('money back') || lower.includes('return')) {
      requestedAction = 'REFUND';
    } else if (lower.includes('cancel') || lower.includes('stop order')) {
      requestedAction = 'CANCELLATION';
    } else if (lower.includes('replace') || lower.includes('broken') || lower.includes('damaged') || lower.includes('cracked')) {
      requestedAction = 'REPLACEMENT';
    }

    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('immediately')) {
      urgency = 'HIGH';
    }

    if (lower.includes('crack') || lower.includes('broken') || lower.includes('damaged')) {
      reportedIssue = 'PHYSICAL_DAMAGE';
    }

    return {
      intent: requestedAction,
      primaryGoal: `Resolve customer request for ${requestedAction.toLowerCase()}`,
      reportedIssue,
      urgency,
      rawGoal: text,
      summary: `Parsed customer intent: ${requestedAction} (Issue: ${reportedIssue}, Urgency: ${urgency})`,
    };
  },
};

export default goalParser;
