const mongoose = require('mongoose');
const { CASE_STATUSES } = require('../config/constants');

const CaseSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    customerGoal: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(CASE_STATUSES),
      default: CASE_STATUSES.OPEN,
      index: true
    },
    currentRunId: { type: String, index: true },
    evidence: { type: mongoose.Schema.Types.Mixed, default: {} },
    decisions: [
      {
        step: { type: Number },
        summary: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    outcome: {
      type: {
        type: String,
        enum: ['REFUND', 'REPLACEMENT', 'CANCELLATION', 'ESCALATED', 'NONE'],
        default: 'NONE'
      },
      summary: { type: String },
      amount: { type: Number },
      verified: { type: Boolean, default: false }
    },
    escalationReason: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Case || mongoose.model('Case', CaseSchema);
