import mongoose from 'mongoose';

const agentEventSchema = new mongoose.Schema(
  {
    runId: { type: String, required: true },
    caseId: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'GOAL_RECEIVED',
        'INVESTIGATION',
        'TOOL_SELECTION',
        'TOOL_EXECUTION',
        'DECISION',
        'ACTION_STARTED',
        'ACTION_RESULT',
        'FAILURE',
        'OBSERVATION',
        'REPLAN',
        'VERIFICATION',
        'ESCALATION',
        'RESOLUTION',
      ],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    tool: { type: String },
    status: { type: String, enum: ['INFO', 'SUCCESS', 'FAILURE', 'WARNING'], default: 'INFO' },
    summary: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

agentEventSchema.index({ runId: 1, timestamp: 1 });
agentEventSchema.index({ caseId: 1 });

export default mongoose.model('AgentEvent', agentEventSchema);
