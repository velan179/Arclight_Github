const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema(
  {
    policyId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['DAMAGED', 'RETURN', 'CANCELLATION', 'WARRANTY'],
      required: true
    },
    returnWindowDays: { type: Number, required: true, default: 30 },
    replacementAllowed: { type: Boolean, default: true },
    refundAllowed: { type: Boolean, default: true },
    requiresEvidence: { type: Boolean, default: true },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Policy || mongoose.model('Policy', PolicySchema);
