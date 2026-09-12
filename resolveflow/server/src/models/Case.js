import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    orderId: { type: String, required: true },
    customerGoal: { type: String, required: true },
    category: {
      type: String,
      enum: ['DAMAGED_ITEM', 'WRONG_ITEM', 'NOT_RECEIVED', 'RETURN_REQUEST', 'GENERAL'],
      default: 'DAMAGED_ITEM',
    },
    status: {
      type: String,
      enum: [
        'OPEN',
        'INVESTIGATING',
        'DECIDING',
        'ACTION_IN_PROGRESS',
        'OBSERVING',
        'REPLANNING',
        'VERIFYING',
        'RESOLVED',
        'ESCALATED',
      ],
      default: 'OPEN',
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    activeRunId: { type: String },
    evidence: {
      customerVerified: { type: Boolean, default: false },
      orderEligible: { type: Boolean, default: false },
      policyMatched: { type: String },
      inventoryChecked: { type: Boolean, default: false },
      inventoryAvailable: { type: Boolean },
      reasonSummary: { type: String },
    },
    decisions: [
      {
        timestamp: { type: Date, default: Date.now },
        decision: String,
        rationale: String,
        status: String,
      },
    ],
    finalOutcome: {
      actionType: String,
      resolvedAt: Date,
      summary: String,
      verificationPassed: Boolean,
    },
    escalationInfo: {
      isEscalated: { type: Boolean, default: false },
      reason: String,
      escalatedAt: Date,
      assignedTo: String,
    },
  },
  { timestamps: true }
);

caseSchema.index({ customerId: 1 });
caseSchema.index({ status: 1 });

export default mongoose.model('Case', caseSchema);
