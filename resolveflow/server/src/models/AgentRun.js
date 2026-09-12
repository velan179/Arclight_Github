import mongoose from 'mongoose';

const agentRunSchema = new mongoose.Schema(
  {
    runId: { type: String, required: true, unique: true },
    caseId: { type: String, required: true },
    goal: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'ESCALATED'],
      default: 'PENDING',
    },
    currentStage: {
      type: String,
      enum: [
        'GOAL_RECEIVED',
        'INVESTIGATION',
        'DECISION',
        'ACTION',
        'OBSERVATION',
        'FAILURE',
        'REPLAN',
        'VERIFICATION',
        'RESOLUTION',
        'ESCALATION',
      ],
      default: 'GOAL_RECEIVED',
    },
    planAttempts: { type: Number, default: 1 },
    initialPlan: { type: String },
    replanReason: { type: String },
    chaosMode: {
      simulateInventoryOutage: { type: Boolean, default: false },
      simulateActionFailure: { type: Boolean, default: false },
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    summary: { type: String },
  },
  { timestamps: true }
);

agentRunSchema.index({ caseId: 1 });

export default mongoose.model('AgentRun', agentRunSchema);
