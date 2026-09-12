/**
 * Data Model Type Definitions for ResolveFlow UI
 *
 * @typedef {Object} Case
 * @property {string} id
 * @property {string} caseNumber
 * @property {string} customerId
 * @property {string} orderId
 * @property {string} customerGoal
 * @property {'OPEN'|'INVESTIGATING'|'DECIDING'|'ACTION_IN_PROGRESS'|'OBSERVING'|'REPLANNING'|'VERIFYING'|'RESOLVED'|'ESCALATED'} status
 * @property {string} [agentRunId]
 * @property {Object} [evidence]
 * @property {Array<{step: number, summary: string, timestamp: string}>} [decisions]
 * @property {{type: string, amount: number, verified: boolean}} [outcome]
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * @typedef {Object} AgentEvent
 * @property {string} runId
 * @property {'GOAL_RECEIVED'|'INVESTIGATION'|'TOOL_SELECTION'|'TOOL_EXECUTION'|'DECISION'|'ACTION_STARTED'|'ACTION_RESULT'|'FAILURE'|'OBSERVATION'|'REPLAN'|'VERIFICATION'|'ESCALATION'|'RESOLUTION'} type
 * @property {string} [tool]
 * @property {'PENDING'|'SUCCESS'|'FAILURE'} status
 * @property {string} summary
 * @property {Object} [metadata]
 * @property {string} timestamp
 */

export const TYPE_DOCS = true;
