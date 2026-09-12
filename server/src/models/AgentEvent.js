const mongoose = require('mongoose');
const { AGENT_EVENT_TYPES } = require('../config/constants');

const AgentEventSchema = new mongoose.Schema(
  {
    runId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentRun', required: true, index: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(AGENT_EVENT_TYPES),
      required: true,
      index: true
    },
    tool: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILURE'],
      default: 'SUCCESS'
    },
    summary: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.AgentEvent || mongoose.model('AgentEvent', AgentEventSchema);
