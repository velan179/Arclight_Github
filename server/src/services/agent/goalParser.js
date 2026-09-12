'use strict';
/**
 * goalParser.js — Member 2
 *
 * Converts a natural language customer goal string into a structured,
 * validated goal object. Uses keyword/pattern matching (deterministic NLP)
 * rather than an external LLM call — fast, auditable, and zero-cost.
 *
 * The LLM assists the orchestrator later; this parser provides the seed structure.
 */

// ── Intent patterns ──────────────────────────────────────────────────────────
const INTENT_PATTERNS = [
  { intent: 'DAMAGED_ITEM',    patterns: [/damage/i, /broken/i, /cracked/i, /defective/i, /faulty/i, /arrived.*bad/i, /bad.*condition/i] },
  { intent: 'WRONG_ITEM',      patterns: [/wrong item/i, /wrong product/i, /incorrect/i, /sent wrong/i] },
  { intent: 'NOT_RECEIVED',    patterns: [/not received/i, /never arrived/i, /missing/i, /not delivered/i, /where.*order/i] },
  { intent: 'RETURN_REQUEST',  patterns: [/return/i, /send back/i, /give back/i] },
  { intent: 'CANCELLATION',    patterns: [/cancel/i, /cancellation/i] },
  { intent: 'WARRANTY_CLAIM',  patterns: [/warranty/i, /guarantee/i, /under warranty/i] },
];

// ── Resolution patterns ──────────────────────────────────────────────────────
const RESOLUTION_PATTERNS = [
  { resolution: 'REPLACEMENT', patterns: [/replacement/i, /replace/i, /exchange/i, /swap/i, /new one/i] },
  { resolution: 'REFUND',      patterns: [/refund/i, /money back/i, /reimburse/i, /repay/i] },
  { resolution: 'CANCELLATION',patterns: [/cancel/i, /stop the order/i] },
];

// ── Urgency patterns ─────────────────────────────────────────────────────────
const URGENCY_PATTERNS = [
  { urgency: 'CRITICAL', patterns: [/urgent/i, /asap/i, /immediately/i, /critical/i, /emergency/i] },
  { urgency: 'HIGH',     patterns: [/quickly/i, /as soon as possible/i, /right away/i, /soon/i] },
  { urgency: 'NORMAL',   patterns: [] }, // default fallback
];

// ── Category mapping for policy engine ──────────────────────────────────────
const INTENT_TO_CATEGORY = {
  DAMAGED_ITEM:   'DAMAGED',
  WRONG_ITEM:     'RETURN',
  NOT_RECEIVED:   'RETURN',
  RETURN_REQUEST: 'RETURN',
  CANCELLATION:   'CANCELLATION',
  WARRANTY_CLAIM: 'WARRANTY',
};

/**
 * Match a text against a list of pattern groups, return the first match.
 * @param {string} text
 * @param {Array<{key: string, patterns: RegExp[]}>} groups
 * @param {string} keyProp
 * @param {string} defaultValue
 */
function matchFirst(text, groups, keyProp, defaultValue) {
  for (const group of groups) {
    if (group.patterns.some(p => p.test(text))) {
      return group[keyProp];
    }
  }
  return defaultValue;
}

/**
 * Parse a raw customer goal string into a structured goal object.
 *
 * @param {string} customerGoal — raw natural language
 * @returns {Object} structured goal
 */
function parseGoal(customerGoal) {
  if (!customerGoal || typeof customerGoal !== 'string') {
    throw new Error('customerGoal must be a non-empty string');
  }

  const text = customerGoal.trim();

  const intent = matchFirst(text, INTENT_PATTERNS, 'intent', 'GENERAL_COMPLAINT');
  const requestedResolution = matchFirst(text, RESOLUTION_PATTERNS, 'resolution', 'UNSPECIFIED');
  const urgency = matchFirst(text, URGENCY_PATTERNS, 'urgency', 'NORMAL');
  const policyCategory = INTENT_TO_CATEGORY[intent] || 'DAMAGED';

  // Constraints derived from text
  const constraints = [];
  if (/\d+ days?/i.test(text)) constraints.push('TIME_SENSITIVE');
  if (/gift/i.test(text)) constraints.push('GIFT_ORDER');
  if (/business/i.test(text)) constraints.push('BUSINESS_ORDER');

  const goal = {
    intent,
    requestedResolution,
    policyCategory,
    customerGoal: text,
    urgency,
    constraints,
    parsedAt: new Date().toISOString()
  };

  // Validation
  _validate(goal);
  return goal;
}

/**
 * Validate a parsed goal. Throws on invalid structure.
 * @param {Object} goal
 */
function _validate(goal) {
  const validIntents = ['DAMAGED_ITEM', 'WRONG_ITEM', 'NOT_RECEIVED', 'RETURN_REQUEST', 'CANCELLATION', 'WARRANTY_CLAIM', 'GENERAL_COMPLAINT'];
  const validResolutions = ['REPLACEMENT', 'REFUND', 'CANCELLATION', 'UNSPECIFIED'];
  const validUrgencies = ['CRITICAL', 'HIGH', 'NORMAL'];

  if (!validIntents.includes(goal.intent)) throw new Error(`Invalid intent: ${goal.intent}`);
  if (!validResolutions.includes(goal.requestedResolution)) throw new Error(`Invalid resolution: ${goal.requestedResolution}`);
  if (!validUrgencies.includes(goal.urgency)) throw new Error(`Invalid urgency: ${goal.urgency}`);
  if (!goal.customerGoal) throw new Error('customerGoal is required');
}

module.exports = { parseGoal };
