export const mockCases = [
  {
    id: 'case_1001',
    caseNumber: 'CASE-001001',
    customerId: 'cust_101',
    orderId: 'ord_5001',
    customerGoal: 'My laptop arrived damaged. I want a replacement.',
    status: 'RESOLVED',
    agentRunId: 'run_9001',
    evidence: {
      orderDelivered: true,
      product: 'MacBook Pro M3 14-inch',
      returnWindowValid: true,
      replacementStockAvailable: false
    },
    decisions: [
      { step: 1, summary: 'Initial decision: Request replacement item', timestamp: new Date(Date.now() - 3000).toISOString() },
      { step: 2, summary: 'Re-planned decision: Stock depleted, initiate $1,999.00 refund', timestamp: new Date(Date.now() - 1000).toISOString() }
    ],
    outcome: {
      type: 'REFUND',
      amount: 1999.00,
      verified: true
    },
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const mockEvents = [
  {
    runId: 'run_9001',
    type: 'GOAL_RECEIVED',
    timestamp: '2026-09-12T10:00:01.100Z',
    summary: 'Customer requested damaged laptop replacement',
    status: 'SUCCESS',
    metadata: {}
  },
  {
    runId: 'run_9001',
    type: 'INVESTIGATION',
    tool: 'customer.get',
    timestamp: '2026-09-12T10:00:01.500Z',
    summary: 'Retrieved customer profile (VIP Tier)',
    status: 'SUCCESS',
    metadata: { tier: 'VIP' }
  },
  {
    runId: 'run_9001',
    type: 'TOOL_EXECUTION',
    tool: 'inventory.check',
    timestamp: '2026-09-12T10:00:02.000Z',
    summary: 'Checked replacement stock for SKU-MBP-14',
    status: 'SUCCESS',
    metadata: { available: 0 }
  },
  {
    runId: 'run_9001',
    type: 'FAILURE',
    timestamp: '2026-09-12T10:00:02.300Z',
    summary: 'Replacement stock unavailable (0 units in WH-US-EAST)',
    status: 'FAILURE',
    metadata: { error: 'STOCK_EMPTY' }
  },
  {
    runId: 'run_9001',
    type: 'REPLAN',
    timestamp: '2026-09-12T10:00:03.000Z',
    summary: 'Adapted plan: Initiated full monetary refund recovery pathway',
    status: 'SUCCESS',
    metadata: { alternative: 'REFUND' }
  },
  {
    runId: 'run_9001',
    type: 'ACTION_RESULT',
    timestamp: '2026-09-12T10:00:03.800Z',
    summary: 'Refund of $1,999.00 processed successfully',
    status: 'SUCCESS',
    metadata: { actionId: 'act_ref_8821' }
  },
  {
    runId: 'run_9001',
    type: 'VERIFICATION',
    timestamp: '2026-09-12T10:00:04.200Z',
    summary: 'Verified refund transaction and order state in MongoDB',
    status: 'SUCCESS',
    metadata: { verified: true }
  },
  {
    runId: 'run_9001',
    type: 'RESOLUTION',
    timestamp: '2026-09-12T10:00:04.500Z',
    summary: 'Case successfully resolved with closed audit loop',
    status: 'SUCCESS',
    metadata: { finalOutcome: 'REFUND_COMPLETED' }
  }
];
