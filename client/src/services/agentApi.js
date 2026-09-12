import api from './api';
import { mockEvents } from './mockData';

export const agentApi = {
  /**
   * Trigger autonomous agent execution on a case.
   * Payload format per API contract: { caseId, simulateFailure }
   */
  async runAgent(caseId, simulateFailure = true) {
    try {
      const res = await api.post('/agent/run', { caseId, simulateFailure });
      return res.data;
    } catch (err) {
      console.warn('Backend agent execution endpoint unavailable, using mock run response:', err.message);
      return {
        runId: `run_${Date.now()}`,
        caseId,
        status: 'IN_PROGRESS',
        startTime: new Date().toISOString()
      };
    }
  },

  /**
   * Fetch agent run status summary.
   */
  async getAgentRun(runId) {
    try {
      const res = await api.get(`/agent/runs/${runId}`);
      return res.data;
    } catch (err) {
      return {
        id: runId || 'run_9001',
        caseId: 'case_1001',
        status: 'COMPLETED',
        replanned: true,
        recoveryAction: 'REFUND',
        verificationPassed: true,
        durationMs: 3420
      };
    }
  },

  /**
   * Fetch sequential event stream for live activity & journey graph.
   */
  async getAgentEvents(runId) {
    try {
      const res = await api.get(`/agent/runs/${runId}/events`);
      return res.data || [];
    } catch (err) {
      console.warn(`Backend agent events for run ${runId} unavailable, returning contract mock events:`, err.message);
      return mockEvents;
    }
  }
};
