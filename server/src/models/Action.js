const mongoose = require('mongoose');
const { ACTION_TYPES } = require('../config/constants');

const ActionSchema = new mongoose.Schema(
  {
    actionId: { type: String, required: true, unique: true, index: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    runId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentRun', index: true },
    type: {
      type: String,
      enum: Object.values(ACTION_TYPES),
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REVERTED'],
      default: 'PENDING'
    },
    amount: { type: Number },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    idempotencyKey: { type: String, unique: true, sparse: true },
    failureReason: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Action || mongoose.model('Action', ActionSchema);
