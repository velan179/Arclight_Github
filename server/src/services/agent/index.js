'use strict';
/**
 * Module 2: Autonomous Agent & Replanning Engine
 * Primary Owner: Member 2
 *
 * Public interface consumed by agent.controller.js:
 *   - run(caseId, options)       → triggers full autonomous loop
 *   - getRunById(runId)          → returns AgentRun summary
 *   - getRunEvents(runId)        → returns ordered AgentEvent stream
 */

const orchestrator = require('./orchestrator');
const AgentRun     = require('../../models/AgentRun');
const AgentEvent   = require('../../models/AgentEvent');

const agentService = {
  /**
   * Trigger the full autonomous resolution loop for a case.
   *
   * @param {string} caseId
   * @param {Object} options — { simulateFailure: boolean }
   * @returns {Promise<Object>}
   */
  run: async (caseId, options = {}) => {
    return orchestrator.run(caseId, options);
  },

  /**
   * Retrieve current state and summary of an AgentRun.
   *
   * @param {string} runId
   * @returns {Promise<Object>}
   */
  getRunById: async (runId) => {
    const run = await AgentRun.findById(runId).lean();
    if (!run) {
      return { id: runId, status: 'NOT_FOUND' };
    }
    return {
      id: run._id.toString(),
      caseId: run.caseId.toString(),
      status: run.status,
      replanned: run.replanned,
      failureEncountered: run.failureEncountered,
      failureReason: run.failureReason,
      recoveryAction: run.recoveryAction,
      durationMs: run.durationMs,
      startTime: run.startTime,
      endTime: run.endTime
    };
  },

  /**
   * Retrieve ordered event stream for live journey visualization.
   *
   * @param {string} runId
   * @returns {Promise<Array>}
   */
  getRunEvents: async (runId) => {
    const events = await AgentEvent
      .find({ runId })
      .sort({ timestamp: 1 })
      .lean();

    return events.map(e => ({
      id: e._id.toString(),
      runId: e.runId.toString(),
      caseId: e.caseId.toString(),
      type: e.type,
      tool: e.tool,
      status: e.status,
      summary: e.summary,
      metadata: e.metadata,
      timestamp: e.timestamp
    }));
  }
};

module.exports = agentService;
