'use strict';
/**
 * failureDetector.js — Member 2
 *
 * Analyses a tool observation and classifies the nature of any failure.
 * Returns a structured failure report — NOT an escalation decision.
 *
 * The orchestrator decides whether to replan or escalate based on this report.
 */

// ── Failure categories ───────────────────────────────────────────────────────
const FAILURE_TYPES = {
  STOCK_EMPTY:              'STOCK_EMPTY',
  POLICY_VIOLATION:         'POLICY_VIOLATION',
  ENTITY_NOT_FOUND:         'ENTITY_NOT_FOUND',
  ACTION_EXECUTION_FAILED:  'ACTION_EXECUTION_FAILED',
  VERIFICATION_FAILED:      'VERIFICATION_FAILED',
  ACCOUNT_SUSPENDED:        'ACCOUNT_SUSPENDED',
  ORDER_NOT_DELIVERED:      'ORDER_NOT_DELIVERED',
  ALREADY_DELIVERED:        'ALREADY_DELIVERED',
  UNKNOWN:                  'UNKNOWN'
};

/**
 * Detect and classify a failure from a tool observation.
 *
 * @param {Object} observation — Tool result (status, errorCode, flags, summary)
 * @param {string} toolName — The tool that produced this observation
 * @returns {{ isFailure: boolean, type: string|null, recoverable: boolean, detail: string }}
 */
function detect(observation, toolName) {
  if (!observation) {
    return { isFailure: true, type: FAILURE_TYPES.UNKNOWN, recoverable: false, detail: 'Null observation received' };
  }

  const { status, errorCode, flags = [], summary } = observation;

  // ── Account suspended (check BEFORE early-return — it rides on SUCCESS status) ─
  if (flags.includes('ACCOUNT_SUSPENDED')) {
    return {
      isFailure: true,
      type: FAILURE_TYPES.ACCOUNT_SUSPENDED,
      recoverable: false,
      detail: 'Customer account is suspended — cannot proceed autonomously'
    };
  }

  // ── Not a failure ────────────────────────────────────────────────────────
  if (status === 'SUCCESS' && !flags.includes('VERIFICATION_FAILED') && !flags.includes('STOCK_EMPTY')) {
    return { isFailure: false, type: null, recoverable: true, detail: summary };
  }

  // ── Stock empty ──────────────────────────────────────────────────────────
  if (flags.includes('STOCK_EMPTY') || errorCode === 'INSUFFICIENT_STOCK') {
    return {
      isFailure: true,
      type: FAILURE_TYPES.STOCK_EMPTY,
      recoverable: true,
      detail: `Replacement stock unavailable for tool: ${toolName}`,
      affectedAction: 'REPLACEMENT'
    };
  }

  // ── Policy violation ─────────────────────────────────────────────────────
  if (errorCode === 'POLICY_VIOLATION' || flags.includes('RETURN_WINDOW_EXPIRED')) {
    return {
      isFailure: true,
      type: FAILURE_TYPES.POLICY_VIOLATION,
      recoverable: false,
      detail: 'Policy violation or return window expired — escalation required'
    };
  }

  // ── Entity not found ─────────────────────────────────────────────────────
  if (errorCode === 'NOT_FOUND') {
    return {
      isFailure: true,
      type: FAILURE_TYPES.ENTITY_NOT_FOUND,
      recoverable: false,
      detail: `Required entity not found by tool: ${toolName}`
    };
  }

  // ── Verification failure ─────────────────────────────────────────────────
  if (flags.includes('VERIFICATION_FAILED') || (toolName === 'verification.run' && !observation.data?.verified)) {
    return {
      isFailure: true,
      type: FAILURE_TYPES.VERIFICATION_FAILED,
      recoverable: true,
      detail: 'State verification detected mismatches — replan may be needed'
    };
  }

  // ── Already delivered (cancel attempt) ───────────────────────────────────
  if (flags.includes('ALREADY_DELIVERED')) {
    return {
      isFailure: true,
      type: FAILURE_TYPES.ALREADY_DELIVERED,
      recoverable: true,
      detail: 'Cancellation invalid — order already delivered; consider refund'
    };
  }

  // ── Generic action failure ───────────────────────────────────────────────
  if (status === 'FAILURE') {
    return {
      isFailure: true,
      type: FAILURE_TYPES.ACTION_EXECUTION_FAILED,
      recoverable: true,
      detail: summary || `Tool ${toolName} returned FAILURE`
    };
  }

  return { isFailure: false, type: null, recoverable: true, detail: summary };
}

module.exports = { detect, FAILURE_TYPES };
