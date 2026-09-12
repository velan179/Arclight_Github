import customerTool from '../../tools/customer.tool.js';
import orderTool from '../../tools/order.tool.js';
import inventoryTool from '../../tools/inventory.tool.js';
import policyTool from '../../tools/policy.tool.js';
import refundTool from '../../tools/refund.tool.js';
import replacementTool from '../../tools/replacement.tool.js';
import cancelTool from '../../tools/cancel.tool.js';
import verificationTool from '../../tools/verification.tool.js';

export const toolRegistry = {
  [customerTool.name]: customerTool,
  [orderTool.name]: orderTool,
  [inventoryTool.name]: inventoryTool,
  [policyTool.name]: policyTool,
  [refundTool.name]: refundTool,
  [replacementTool.name]: replacementTool,
  [cancelTool.name]: cancelTool,
  [verificationTool.name]: verificationTool,
};

export const toolSelector = {
  getTool(name) {
    return toolRegistry[name] || null;
  },

  getAllTools() {
    return Object.values(toolRegistry);
  },

  selectNextTool({ stage, intent, observations, replanning }) {
    if (stage === 'INVESTIGATION') {
      if (!observations.customer) return { toolName: customerTool.name, reason: 'Verify customer account and tier' };
      if (!observations.order) return { toolName: orderTool.name, reason: 'Inspect order details and delivery timestamp' };
      if (!observations.policy) return { toolName: policyTool.name, reason: 'Check enterprise policy eligibility' };
      if (intent === 'REPLACEMENT' && !observations.inventory) return { toolName: inventoryTool.name, reason: 'Check warehouse stock availability for replacement' };
      return null;
    }

    if (stage === 'ACTION') {
      if (replanning && observations.replanAction === 'REFUND') {
        return { toolName: refundTool.name, reason: 'Execute refund as fallback resolution' };
      }
      if (intent === 'REPLACEMENT') {
        return { toolName: replacementTool.name, reason: 'Execute replacement shipment dispatch' };
      }
      if (intent === 'REFUND') {
        return { toolName: refundTool.name, reason: 'Execute customer refund' };
      }
      return { toolName: cancelTool.name, reason: 'Execute order cancellation' };
    }

    if (stage === 'VERIFICATION') {
      return { toolName: verificationTool.name, reason: 'Perform post-action deterministic state verification' };
    }

    return null;
  },
};

export default toolSelector;
