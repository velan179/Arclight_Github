import api from './api';
import { mockCases } from './mockData';

export const casesApi = {
  /**
   * Fetch case list with optional status filter, page, and limit.
   */
  async getCases(params = {}) {
    try {
      const res = await api.get('/cases', { params });
      return res.data || [];
    } catch (err) {
      console.warn('Backend cases endpoint unavailable, using mock data:', err.message);
      let cases = [...mockCases];
      if (params.status && params.status !== 'ALL') {
        const targetStatus = params.status.toUpperCase();
        cases = cases.filter((c) => {
          if (targetStatus === 'INVESTIGATING') {
            return ['OPEN', 'PENDING_APPROVAL', 'INVESTIGATING', 'DECIDING', 'ACTION_IN_PROGRESS', 'OBSERVING'].includes(c.status);
          }
          if (targetStatus === 'REPLANNING') {
            return c.status === 'REPLANNING';
          }
          return c.status === targetStatus;
        });
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        cases = cases.filter(
          (c) =>
            c.id?.toLowerCase().includes(query) ||
            c.caseNumber?.toLowerCase().includes(query) ||
            c.customerId?.toLowerCase().includes(query) ||
            c.orderId?.toLowerCase().includes(query) ||
            c.customerGoal?.toLowerCase().includes(query)
        );
      }
      return cases;
    }
  },

  /**
   * Fetch single case by ID.
   */
  async getCaseById(id) {
    try {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    } catch (err) {
      console.warn(`Backend case ${id} unavailable, using mock fallback:`, err.message);
      const found = mockCases.find((c) => c.id === id || c.caseNumber === id);
      if (found) return found;
      return mockCases[0];
    }
  },

  /**
   * Create a new customer case.
   * Payload format per API contract: { customerId, orderId, customerGoal }
   */
  async createCase(payload) {
    try {
      const res = await api.post('/cases', payload);
      return res.data;
    } catch (err) {
      console.warn('Backend case creation failed/unavailable, creating mock case response:', err.message);
      const newCase = {
        id: `case_${Date.now()}`,
        caseNumber: `CASE-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: payload.customerId,
        orderId: payload.orderId,
        customerGoal: payload.customerGoal,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // Temporarily store in mockCases array for dev demo
      mockCases.unshift(newCase);
      return newCase;
    }
  }
};
