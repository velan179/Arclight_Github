import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    verificationId: { type: String, required: true, unique: true },
    caseId: { type: String, required: true },
    runId: { type: String, required: true },
    actionId: { type: String, required: true },
    verified: { type: Boolean, required: true },
    checksPerformed: [
      {
        checkName: String,
        status: { type: String, enum: ['PASSED', 'FAILED'] },
        expectedValue: String,
        actualValue: String,
        description: String,
      },
    ],
    auditSummary: { type: String, required: true },
    verifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

verificationSchema.index({ runId: 1 });
verificationSchema.index({ caseId: 1 });

export default mongoose.model('Verification', verificationSchema);
