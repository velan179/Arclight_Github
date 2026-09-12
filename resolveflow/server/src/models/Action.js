import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema(
  {
    actionId: { type: String, required: true, unique: true },
    caseId: { type: String, required: true },
    runId: { type: String, required: true },
    type: {
      type: String,
      enum: ['REFUND', 'REPLACEMENT', 'CANCELLATION'],
      required: true,
    },
    status: {
      type: String,
      enum: ['INITIATED', 'PENDING', 'COMPLETED', 'FAILED'],
      default: 'INITIATED',
    },
    idempotencyKey: { type: String, required: true, unique: true },
    amount: { type: Number },
    currency: { type: String, default: 'USD' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    failureReason: { type: String },
    executedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

actionSchema.index({ caseId: 1 });

export default mongoose.model('Action', actionSchema);
