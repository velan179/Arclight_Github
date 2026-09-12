const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema(
  {
    runId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentRun', required: true, unique: true, index: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    verified: { type: Boolean, required: true },
    checkedItems: [
      {
        item: { type: String, required: true },
        status: { type: String, enum: ['CONFIRMED', 'MISMATCH', 'ERROR'], required: true },
        details: { type: mongoose.Schema.Types.Mixed }
      }
    ],
    verifiedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);
