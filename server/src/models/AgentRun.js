const mongoose = require('mongoose');

const AgentRunSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    status: {
      type: String,
      enum: ['INITIALIZED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ESCALATED'],
      default: 'INITIALIZED'
    },
    replanned: { type: Boolean, default: false },
    failureEncountered: { type: Boolean, default: false },
    failureReason: { type: String },
    recoveryAction: { type: String },
    durationMs: { type: Number },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.AgentRun || mongoose.model('AgentRun', AgentRunSchema);
