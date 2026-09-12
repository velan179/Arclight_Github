import mongoose from 'mongoose';

const policySchema = new mongoose.Schema(
  {
    policyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['REFUND', 'REPLACEMENT', 'CANCELLATION'],
      required: true,
    },
    returnWindowDays: { type: Number, default: 30 },
    maxRefundAmount: { type: Number, default: 5000 },
    requiresProofOfDamage: { type: Boolean, default: true },
    autoApprovalTier: [{ type: String }], // e.g. ['standard', 'premium', 'vip']
    rulesDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

policySchema.index({ type: 1 });

export default mongoose.model('Policy', policySchema);
