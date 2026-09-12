'use strict';
/**
 * orchestrator.js — Member 2
 *
 * The Autonomous Agent Loop for ResolveFlow.
 *
 * Loop pattern:
 *   OBSERVE → DECIDE → TOOL → RESULT → OBSERVE → DECIDE → ...
 *
 * The next action always depends on previous observations.
 * This is NOT a fixed sequence.
 *
 * Protections:
 *  - MAX_ITERATIONS cap (no infinite loops)
 *  - Timeout guard
 *  - Duplicate action prevention
 *  - All DB mutations via deterministic tools (LLM-free side effects)
 */

const { parseGoal }         = require('./goalParser');
const { selectNextTool }    = require('./toolSelector');
const { plan }              = require('./planner');
const { detect }            = require('./failureDetector');
const { replan }            = require('./replanner');
const { buildEscalation }   = require('./escalationHandler');
const toolRegistry          = require('../../tools');

const AgentRun   = require('../../models/AgentRun');
const AgentEvent = require('../../models/AgentEvent');
const Case       = require('../../models/Case');

const { AGENT_EVENT_TYPES, CASE_STATUSES } = require('../../config/constants');

// ── Constants ────────────────────────────────────────────────────────────────
const MAX_ITERATIONS     = 20;
const LOOP_TIMEOUT_MS    = 60_000; // 1 minute hard stop

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Persist a structured agent event.
 */
async function emitEvent(runId, caseId, type, summary, opts = {}) {
  const { tool, status = 'SUCCESS', metadata = {} } = opts;
  try {
    await AgentEvent.create({ runId, caseId, type, summary, tool, status, metadata, timestamp: new Date() });
  } catch (err) {
    // Non-fatal — log but don't crash the loop
    console.error(`[Orchestrator] Event emit failed (${type}):`, err.message);
  }
}

/**
 * Update the Case status in the DB.
 */
async function updateCaseStatus(caseId, status, extra = {}) {
  try {
    await Case.findByIdAndUpdate(caseId, { status, ...extra, updatedAt: new Date() });
  } catch (err) {
    console.error(`[Orchestrator] Case status update failed:`, err.message);
  }
}

// ── Main loop ────────────────────────────────────────────────────────────────

/**
 * Run the autonomous agent loop for a case.
 *
 * @param {string} caseId — MongoDB ObjectId string
 * @param {Object} [options]
 * @param {boolean} [options.simulateFailure=false] — Force inventory failure for demo
 * @returns {Promise<Object>} Final run summary
 */
async function run(caseId, options = {}) {
  const { simulateFailure = false } = options;
  const startTime = Date.now();

  // ── 1. Load case ─────────────────────────────────────────────────────────
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) throw new Error(`Case ${caseId} not found`);

  // ── 2. Create AgentRun record ─────────────────────────────────────────────
  const agentRun = await AgentRun.create({
    caseId,
    status: 'IN_PROGRESS',
    startTime: new Date()
  });
  const runId = agentRun._id;

  // Update case with runId
  await Case.findByIdAndUpdate(caseId, {
    currentRunId: runId.toString(),
    status: CASE_STATUSES.INVESTIGATING
  });

  // ── 3. Parse goal ─────────────────────────────────────────────────────────
  let goal;
  try {
    goal = parseGoal(caseDoc.customerGoal);
  } catch (err) {
    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ESCALATION,
      `Goal parsing failed: ${err.message}`, { status: 'FAILURE' });
    await agentRun.updateOne({ status: 'FAILED', failureReason: err.message, endTime: new Date() });
    return { runId: runId.toString(), status: 'FAILED', reason: err.message };
  }

  await emitEvent(runId, caseId, AGENT_EVENT_TYPES.GOAL_RECEIVED,
    `Goal parsed: intent=${goal.intent}, resolution=${goal.requestedResolution}, urgency=${goal.urgency}`,
    { metadata: goal });

  // ── 4. Initialize shared state ────────────────────────────────────────────
  const state = {
    customerId: caseDoc.customerId,
    orderId: caseDoc.orderId,
    customer: null,
    order: null,
    policy: null,
    inventory: null,
    failedActions: new Set()
  };

  const executedTools  = new Set();
  let iteration        = 0;
  let isResolved       = false;
  let isEscalated      = false;
  let finalOutcome     = null;
  let replanCount      = 0;

  // ── 5. OBSERVE → DECIDE → TOOL loop ──────────────────────────────────────
  while (!isResolved && !isEscalated && iteration < MAX_ITERATIONS) {
    iteration++;

    // Timeout guard
    if (Date.now() - startTime > LOOP_TIMEOUT_MS) {
      const esc = buildEscalation({
        caseId, runId: runId.toString(), goal, state,
        reason: 'Maximum execution time exceeded',
        triggerType: 'MAX_ITERATIONS_REACHED',
        iterationsUsed: iteration
      });
      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ESCALATION,
        esc.summary, { status: 'FAILURE', metadata: esc });
      isEscalated = true;
      break;
    }

    // ── Phase A: INVESTIGATION — gather missing evidence ───────────────────
    const nextTool = selectNextTool(goal, state, executedTools, { simulateFailure });

    if (nextTool) {
      await updateCaseStatus(caseId, CASE_STATUSES.INVESTIGATING);

      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.TOOL_SELECTION,
        `Selected tool: ${nextTool.toolName} — ${nextTool.rationale}`,
        { tool: nextTool.toolName, metadata: { params: nextTool.params } });

      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.INVESTIGATION,
        `Investigating: ${nextTool.toolName}`,
        { tool: nextTool.toolName });

      const observation = await toolRegistry.execute(nextTool.toolName, nextTool.params);
      executedTools.add(nextTool.toolName);

      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.TOOL_EXECUTION,
        observation.summary,
        { tool: nextTool.toolName, status: observation.status === 'SUCCESS' ? 'SUCCESS' : 'FAILURE', metadata: observation.data || {} });

      // Store observation in state
      _applyObservation(state, nextTool.toolName, observation);

      // Detect failures in investigation
      const failure = detect(observation, nextTool.toolName);
      if (failure.isFailure && !failure.recoverable) {
        const esc = buildEscalation({
          caseId, runId: runId.toString(), goal, state,
          reason: failure.detail,
          triggerType: 'MISSING_INFORMATION',
          iterationsUsed: iteration
        });
        await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ESCALATION,
          esc.summary, { status: 'FAILURE', metadata: esc });
        isEscalated = true;
        break;
      }

      // Continue investigation in next iteration
      continue;
    }

    // ── Phase B: DECIDING — select resolution action ───────────────────────
    await updateCaseStatus(caseId, CASE_STATUSES.DECIDING);

    const planResult = plan(goal, state, state.failedActions);

    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.DECISION,
      planResult.rationale,
      { metadata: { selected: planResult.selected, candidates: planResult.candidates } });

    if (planResult.requiresEscalation || !planResult.selected) {
      const esc = buildEscalation({
        caseId, runId: runId.toString(), goal, state,
        reason: planResult.escalationReason || 'No viable resolution candidate',
        triggerType: 'NO_VIABLE_ALTERNATIVE',
        failedActions: Array.from(state.failedActions),
        iterationsUsed: iteration
      });
      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ESCALATION,
        esc.summary, { status: 'FAILURE', metadata: esc });
      isEscalated = true;
      break;
    }

    // ── Phase C: ACTION ────────────────────────────────────────────────────
    await updateCaseStatus(caseId, CASE_STATUSES.ACTION_IN_PROGRESS);
    const actionType = planResult.selected;

    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ACTION_STARTED,
      `Executing action: ${actionType}`,
      { metadata: { actionType } });

    // Prevent duplicate actions
    if (state.failedActions.has(actionType) || executedTools.has(`action_executed_${actionType}`)) {
      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.FAILURE,
        `Duplicate action prevention: ${actionType} already attempted`,
        { status: 'FAILURE', metadata: { actionType } });
      state.failedActions.add(actionType);
      continue;
    }

    const actionObservation = await _executeAction(actionType, state, runId, caseId, simulateFailure);
    executedTools.add(`action_executed_${actionType}`);

    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ACTION_RESULT,
      actionObservation.summary,
      { tool: _actionToToolName(actionType), status: actionObservation.status, metadata: actionObservation.data || {} });

    // Observe action result
    await updateCaseStatus(caseId, CASE_STATUSES.OBSERVING);
    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.OBSERVATION,
      `Observing result of ${actionType}: ${actionObservation.summary}`,
      { metadata: { status: actionObservation.status } });

    const actionFailure = detect(actionObservation, _actionToToolName(actionType));

    // ── Phase D: FAILURE → REPLAN ──────────────────────────────────────────
    if (actionFailure.isFailure) {
      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.FAILURE,
        actionFailure.detail,
        { status: 'FAILURE', metadata: { failureType: actionFailure.type, actionType } });

      await agentRun.updateOne({ failureEncountered: true, failureReason: actionFailure.detail });

      if (!actionFailure.recoverable) {
        const esc = buildEscalation({
          caseId, runId: runId.toString(), goal, state,
          reason: actionFailure.detail,
          triggerType: 'NO_VIABLE_ALTERNATIVE',
          failedActions: Array.from(state.failedActions),
          iterationsUsed: iteration
        });
        await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ESCALATION,
          esc.summary, { status: 'FAILURE', metadata: esc });
        isEscalated = true;
        break;
      }

      // Mark action as failed and replan
      state.failedActions.add(actionType);
      replanCount++;

      await updateCaseStatus(caseId, CASE_STATUSES.REPLANNING);

      const replanResult = replan(goal, state, actionType, state.failedActions);
      await agentRun.updateOne({ replanned: true, recoveryAction: replanResult.selected || 'NONE' });

      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.REPLAN,
        replanResult.rationale || `Replanning after ${actionType} failure`,
        { metadata: { alternative: replanResult.selected, failedActions: replanResult.failedActions } });

      if (replanResult.requiresEscalation || !replanResult.selected) {
        const esc = buildEscalation({
          caseId, runId: runId.toString(), goal, state,
          reason: 'No viable alternative after replanning',
          triggerType: 'NO_VIABLE_ALTERNATIVE',
          failedActions: replanResult.failedActions,
          iterationsUsed: iteration
        });
        await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ESCALATION,
          esc.summary, { status: 'FAILURE', metadata: esc });
        isEscalated = true;
        break;
      }

      // Update inventory if needed after replan
      if (replanResult.selected === 'REFUND' && !state.inventory) {
        // No inventory re-check needed for refund path
      }

      // Continue loop — next iteration will plan again with updated failedActions
      continue;
    }

    // ── Phase E: VERIFICATION ──────────────────────────────────────────────
    await updateCaseStatus(caseId, CASE_STATUSES.VERIFYING);

    const verificationObs = await toolRegistry.execute('verification.run', {
      runId: runId.toString(),
      caseId: caseId.toString(),
      expectedOutcome: actionType,
      orderId: state.orderId
    });

    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.VERIFICATION,
      verificationObs.summary,
      { tool: 'verification.run', status: verificationObs.status, metadata: verificationObs.data || {} });

    const verifyFailure = detect(verificationObs, 'verification.run');

    if (verifyFailure.isFailure) {
      // Verification failed — attempt replan if we haven't exhausted options
      state.failedActions.add(actionType);
      replanCount++;
      await updateCaseStatus(caseId, CASE_STATUSES.REPLANNING);

      await emitEvent(runId, caseId, AGENT_EVENT_TYPES.REPLAN,
        `Verification failed for ${actionType} — evaluating alternatives`,
        { status: 'FAILURE', metadata: { failedAction: actionType } });
      continue;
    }

    // ── Phase F: RESOLUTION ────────────────────────────────────────────────
    finalOutcome = actionType;
    isResolved = true;

    const durationMs = Date.now() - startTime;
    await updateCaseStatus(caseId, CASE_STATUSES.RESOLVED, {
      'outcome.type': finalOutcome,
      'outcome.summary': `${finalOutcome} completed and verified`,
      'outcome.amount': state.order?.amount,
      'outcome.verified': true,
      [`decisions`]: [...(caseDoc.decisions || []), { step: replanCount + 1, summary: `Final resolution: ${finalOutcome}`, timestamp: new Date() }]
    });

    await agentRun.updateOne({
      status: 'COMPLETED',
      endTime: new Date(),
      durationMs
    });

    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.RESOLUTION,
      `Case resolved via ${finalOutcome} — verified successfully`,
      { metadata: { finalOutcome, durationMs, replanned: replanCount > 0 } });
  }

  // ── Max iterations safety net ─────────────────────────────────────────────
  if (!isResolved && !isEscalated) {
    const esc = buildEscalation({
      caseId, runId: runId.toString(), goal, state,
      reason: `Maximum iterations (${MAX_ITERATIONS}) reached without resolution`,
      triggerType: 'MAX_ITERATIONS_REACHED',
      iterationsUsed: MAX_ITERATIONS
    });
    await emitEvent(runId, caseId, AGENT_EVENT_TYPES.ESCALATION,
      esc.summary, { status: 'FAILURE', metadata: esc });
    isEscalated = true;
  }

  // ── Finalize AgentRun ─────────────────────────────────────────────────────
  if (isEscalated) {
    const durationMs = Date.now() - startTime;
    await agentRun.updateOne({ status: 'ESCALATED', endTime: new Date(), durationMs });
    await updateCaseStatus(caseId, CASE_STATUSES.ESCALATED);
  }

  return {
    runId: runId.toString(),
    caseId: caseId.toString(),
    status: isResolved ? 'COMPLETED' : 'ESCALATED',
    finalOutcome,
    replanned: replanCount > 0,
    durationMs: Date.now() - startTime,
    iterations: iteration
  };
}

// ── Private helpers ──────────────────────────────────────────────────────────

/**
 * Apply a tool observation to the shared state object.
 */
function _applyObservation(state, toolName, observation) {
  if (observation.status !== 'SUCCESS') return;
  const d = observation.data;
  if (!d) return;

  switch (toolName) {
    case 'customer.get':    state.customer  = d; break;
    case 'order.get':       state.order     = d; break;
    case 'policy.evaluate': state.policy    = d; break;
    case 'inventory.check': state.inventory = d; break;
  }
}

/**
 * Execute a resolution action tool based on action type.
 */
async function _executeAction(actionType, state, runId, caseId, simulateFailure) {
  const base = {
    caseId: caseId.toString(),
    runId: runId.toString(),
    orderId: state.orderId
  };

  switch (actionType) {
    case 'REPLACEMENT':
      return toolRegistry.execute('action.replacement', {
        ...base,
        productId: state.order?.productId,
        simulateFailure
      });

    case 'REFUND':
      return toolRegistry.execute('action.refund', {
        ...base,
        amount: state.order?.amount || 0,
        reason: `Autonomous resolution: ${state.failedActions.size > 0 ? 'Fallback after ' + Array.from(state.failedActions).join(', ') : 'Primary resolution'}`
      });

    case 'CANCELLATION':
      return toolRegistry.execute('action.cancel', {
        ...base,
        reason: 'Customer requested cancellation via autonomous agent'
      });

    default:
      return {
        tool: 'unknown',
        status: 'FAILURE',
        data: null,
        summary: `Unknown action type: ${actionType}`,
        errorCode: 'TOOL_EXECUTION_FAILED'
      };
  }
}

/**
 * Map action type to tool name for logging.
 */
function _actionToToolName(actionType) {
  const map = {
    REPLACEMENT:  'action.replacement',
    REFUND:       'action.refund',
    CANCELLATION: 'action.cancel'
  };
  return map[actionType] || actionType;
}

module.exports = { run };
