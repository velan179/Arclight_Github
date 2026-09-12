import Policy from '../../models/Policy.js';
import { getConnectionState } from '../../config/db.js';

const MOCK_POLICIES = [
  {
    policyId: 'POL-REPLACE-01',
    name: 'Hardware Damage Replacement Policy',
    type: 'REPLACEMENT',
    returnWindowDays: 30,
    maxRefundAmount: 3000,
    requiresProofOfDamage: true,
    autoApprovalTier: ['standard', 'premium', 'vip'],
    rulesDescription: 'Damaged items within 30 days qualify for replacement if stock is available.',
    isActive: true,
  },
  {
    policyId: 'POL-REFUND-01',
    name: 'Standard Customer Refund Policy',
    type: 'REFUND',
    returnWindowDays: 30,
    maxRefundAmount: 2500,
    requiresProofOfDamage: false,
    autoApprovalTier: ['vip', 'premium'],
    rulesDescription: 'Full refund to original payment method allowed within 30 days if replacement unavailable or requested.',
    isActive: true,
  },
];

export const policyService = {
  async getAll() {
    const { isConnected } = getConnectionState();
    if (isConnected) {
      const policies = await Policy.find({ isActive: true });
      if (policies.length > 0) return policies.map((p) => p.toObject());
    }
    return MOCK_POLICIES;
  },

  async checkEligibility({ actionType, customerTier, daysSinceDelivery, amount }) {
    const policies = await this.getAll();
    const policy = policies.find((p) => p.type === actionType.toUpperCase());

    if (!policy) {
      return {
        eligible: false,
        reason: `No active enterprise policy found for action type: ${actionType}`,
      };
    }

    if (daysSinceDelivery > policy.returnWindowDays) {
      return {
        eligible: false,
        policyId: policy.policyId,
        reason: `Request exceeds policy return window (${daysSinceDelivery}d > ${policy.returnWindowDays}d)`,
      };
    }

    if (amount && policy.maxRefundAmount && amount > policy.maxRefundAmount) {
      return {
        eligible: false,
        policyId: policy.policyId,
        reason: `Amount ($${amount}) exceeds maximum threshold ($${policy.maxRefundAmount})`,
      };
    }

    const autoApprove = policy.autoApprovalTier.includes(customerTier?.toLowerCase());

    return {
      eligible: true,
      policyId: policy.policyId,
      policyName: policy.name,
      autoApproved: autoApprove,
      summary: `Policy ${policy.policyId} (${policy.type}) matched and passed: Within ${policy.returnWindowDays}-day window, auto-approved for tier: ${customerTier}.`,
    };
  },
};

export default policyService;
