import Case from '../../models/Case.js';
import { getConnectionState } from '../../config/db.js';

export const escalationHandler = {
  async escalate({ caseId, runId, reason, metadata = {} }) {
    const escalationDetails = {
      isEscalated: true,
      reason,
      escalatedAt: new Date(),
      assignedTo: 'HUMAN_SUPPORT_TIER_2',
    };

    const { isConnected } = getConnectionState();
    if (isConnected) {
      await Case.findOneAndUpdate(
        { caseId },
        {
          status: 'ESCALATED',
          escalationInfo: escalationDetails,
        }
      );
    }

    return {
      escalated: true,
      caseId,
      runId,
      assignedQueue: 'HUMAN_SUPPORT_TIER_2',
      reason,
      summary: `Safe Escalation Triggered: ${reason}. Case assigned to Tier 2 specialist team.`,
      metadata,
    };
  },
};

export default escalationHandler;
