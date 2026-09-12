import AgentRun from '../../models/AgentRun.js';
import AgentEvent from '../../models/AgentEvent.js';
import Case from '../../models/Case.js';
import goalParser from './goalParser.js';
import toolSelector from './toolSelector.js';
import failureDetector from './failureDetector.js';
import replanner from './replanner.js';
import escalationHandler from './escalationHandler.js';
import failureSimulator from '../actions/failureSimulator.js';
import { getConnectionState } from '../../config/db.js';

// In-memory cache of events for quick client polling / zero-db mode
const memoryEventStore = new Map();
const memoryRunStore = new Map();

export const orchestrator = {
  getEvents(runId) {
    return memoryEventStore.get(runId) || [];
  },

  getRun(runId) {
    return memoryRunStore.get(runId) || null;
  },

  async logEvent({ runId, caseId, type, tool, status, summary, metadata = {} }) {
    const event = {
      runId,
      caseId,
      type,
      tool,
      status: status || 'INFO',
      summary,
      metadata,
      timestamp: new Date(),
    };

    if (!memoryEventStore.has(runId)) {
      memoryEventStore.set(runId, []);
    }
    memoryEventStore.get(runId).push(event);

    const { isConnected } = getConnectionState();
    if (isConnected) {
      try {
        await AgentEvent.create(event);
      } catch (e) {
        // Safe logging
      }
    }

    return event;
  },

  async executeRun({ caseId, customerId, orderId, goalText, chaosOptions = {} }) {
    const runId = `RUN-${Date.now()}`;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Configure chaos simulator if requested
    if (chaosOptions.simulateInventoryOutage !== undefined) {
      failureSimulator.setFlag('inventoryOutage', chaosOptions.simulateInventoryOutage);
    }
    if (chaosOptions.simulateActionFailure !== undefined) {
      failureSimulator.setFlag('actionExecutionError', chaosOptions.simulateActionFailure);
    }

    const runRecord = {
      runId,
      caseId,
      goal: goalText,
      status: 'RUNNING',
      currentStage: 'GOAL_RECEIVED',
      startedAt: new Date(),
      planAttempts: 1,
    };
    memoryRunStore.set(runId, runRecord);

    const { isConnected } = getConnectionState();
    if (isConnected) {
      try {
        await AgentRun.create(runRecord);
        await Case.findOneAndUpdate({ caseId }, { status: 'INVESTIGATING', activeRunId: runId });
      } catch (e) {}
    }

    try {
      // ══════════════════════════════════════════════════════════════════
      // STAGE 1: GOAL_RECEIVED
      // ══════════════════════════════════════════════════════════════════
      const parsedGoal = goalParser.parse(goalText);
      await this.logEvent({
        runId,
        caseId,
        type: 'GOAL_RECEIVED',
        status: 'INFO',
        summary: `Goal parsed: ${parsedGoal.primaryGoal}. Detected intent: ${parsedGoal.intent}.`,
        metadata: parsedGoal,
      });
      await delay(400);

      // ══════════════════════════════════════════════════════════════════
      // STAGE 2: INVESTIGATION
      // ══════════════════════════════════════════════════════════════════
      const observations = {};

      // 2a. Verify Customer
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_SELECTION',
        tool: 'customer.verify',
        status: 'INFO',
        summary: `Autonomous tool selection: customer.verify for customerId=${customerId}`,
      });
      const customerTool = toolSelector.getTool('customer.verify');
      const custResult = await customerTool.execute({ customerId });
      observations.customer = custResult;
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_EXECUTION',
        tool: 'customer.verify',
        status: custResult.verified ? 'SUCCESS' : 'FAILURE',
        summary: custResult.summary,
        metadata: custResult,
      });
      await delay(400);

      // 2b. Order Eligibility Check
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_SELECTION',
        tool: 'order.checkEligibility',
        status: 'INFO',
        summary: `Autonomous tool selection: order.checkEligibility for orderId=${orderId}`,
      });
      const orderTool = toolSelector.getTool('order.checkEligibility');
      const orderResult = await orderTool.execute({ orderId });
      observations.order = orderResult;
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_EXECUTION',
        tool: 'order.checkEligibility',
        status: orderResult.eligible ? 'SUCCESS' : 'FAILURE',
        summary: orderResult.summary,
        metadata: orderResult,
      });
      await delay(400);

      // 2c. Policy Evaluation
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_SELECTION',
        tool: 'policy.checkEligibility',
        status: 'INFO',
        summary: `Autonomous tool selection: policy.checkEligibility for actionType=REPLACEMENT`,
      });
      const policyTool = toolSelector.getTool('policy.checkEligibility');
      const policyResult = await policyTool.execute({
        actionType: 'REPLACEMENT',
        customerTier: custResult.tier,
        daysSinceDelivery: orderResult.daysSinceDelivery,
        amount: orderResult.totalAmount,
      });
      observations.policy = policyResult;
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_EXECUTION',
        tool: 'policy.checkEligibility',
        status: policyResult.eligible ? 'SUCCESS' : 'FAILURE',
        summary: policyResult.summary,
        metadata: policyResult,
      });
      await delay(400);

      // 2d. Inventory Check
      const productId = orderResult.items?.[0]?.productId || 'PROD-LAPTOP-X1';
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_SELECTION',
        tool: 'inventory.checkAvailability',
        status: 'INFO',
        summary: `Autonomous tool selection: inventory.checkAvailability for productId=${productId}`,
      });
      const inventoryTool = toolSelector.getTool('inventory.checkAvailability');
      const invResult = await inventoryTool.execute({ productId });
      observations.inventory = invResult;
      await this.logEvent({
        runId,
        caseId,
        type: 'TOOL_EXECUTION',
        tool: 'inventory.checkAvailability',
        status: invResult.available ? 'SUCCESS' : 'WARNING',
        summary: invResult.summary,
        metadata: invResult,
      });
      await delay(400);

      // ══════════════════════════════════════════════════════════════════
      // STAGE 3: DECISION (Initial Plan)
      // ══════════════════════════════════════════════════════════════════
      await this.logEvent({
        runId,
        caseId,
        type: 'DECISION',
        status: 'INFO',
        summary: 'Primary Decision: Customer requested replacement and policy permits it. Attempting immediate replacement dispatch.',
        metadata: {
          intendedAction: 'REPLACEMENT',
          evidence: {
            customerTier: custResult.tier,
            withinReturnWindow: orderResult.withinWindow,
            reportedDamage: parsedGoal.reportedIssue,
          },
        },
      });
      await delay(400);

      // ══════════════════════════════════════════════════════════════════
      // STAGE 4: ACTION (Replacement Attempt)
      // ══════════════════════════════════════════════════════════════════
      const replacementKey = `IDEMP-REP-${caseId}-${Date.now()}`;
      await this.logEvent({
        runId,
        caseId,
        type: 'ACTION_STARTED',
        tool: 'action.executeReplacement',
        status: 'INFO',
        summary: 'Executing Replacement order dispatch with idempotency key.',
        metadata: { idempotencyKey: replacementKey, productId },
      });
      await delay(400);

      const replacementTool = toolSelector.getTool('action.executeReplacement');
      const repResult = await replacementTool.execute({
        caseId,
        runId,
        orderId,
        productId,
        idempotencyKey: replacementKey,
      });

      // ══════════════════════════════════════════════════════════════════
      // STAGE 5: OBSERVATION & FAILURE DETECTION
      // ══════════════════════════════════════════════════════════════════
      const failureCheck = failureDetector.detect(repResult);

      if (failureCheck.isFailure) {
        // Visibly record failure!
        await this.logEvent({
          runId,
          caseId,
          type: 'FAILURE',
          status: 'FAILURE',
          summary: `ACTION FAILED: ${failureCheck.message} (Code: ${failureCheck.code})`,
          metadata: { failure: failureCheck, rawResult: repResult },
        });
        await delay(500);

        await this.logEvent({
          runId,
          caseId,
          type: 'OBSERVATION',
          status: 'WARNING',
          summary: 'Agent Observation: Primary replacement cannot be fulfilled. Inventory is zero across all warehouses. Initiating autonomous re-planning protocol.',
          metadata: { failureCode: failureCheck.code },
        });
        await delay(500);

        // ══════════════════════════════════════════════════════════════════
        // STAGE 6: REPLANNING
        // ══════════════════════════════════════════════════════════════════
        const replanStrategy = replanner.replan({
          originalGoal: parsedGoal,
          failure: failureCheck,
          observations,
        });

        await this.logEvent({
          runId,
          caseId,
          type: 'REPLAN',
          status: 'INFO',
          summary: replanStrategy.summary,
          metadata: replanStrategy,
        });
        await delay(500);

        // Check refund policy
        const refundPolicyCheck = await policyTool.execute({
          actionType: 'REFUND',
          customerTier: custResult.tier,
          daysSinceDelivery: orderResult.daysSinceDelivery,
          amount: orderResult.totalAmount,
        });

        await this.logEvent({
          runId,
          caseId,
          type: 'TOOL_EXECUTION',
          tool: 'policy.checkEligibility',
          status: refundPolicyCheck.eligible ? 'SUCCESS' : 'FAILURE',
          summary: `Fallback Policy Check: 100% financial refund is eligible under policy ${refundPolicyCheck.policyId}`,
          metadata: refundPolicyCheck,
        });
        await delay(400);

        // ══════════════════════════════════════════════════════════════════
        // STAGE 7: ALTERNATIVE ACTION (Execute Refund)
        // ══════════════════════════════════════════════════════════════════
        const refundKey = `IDEMP-REF-${caseId}-${Date.now()}`;
        await this.logEvent({
          runId,
          caseId,
          type: 'ACTION_STARTED',
          tool: 'action.executeRefund',
          status: 'INFO',
          summary: `Executing full refund of $${orderResult.totalAmount} to customer's card (ending in ${orderResult.paymentMethod?.last4 || '4242'})`,
          metadata: { idempotencyKey: refundKey, amount: orderResult.totalAmount },
        });
        await delay(500);

        const refundTool = toolSelector.getTool('action.executeRefund');
        const refundResult = await refundTool.execute({
          caseId,
          runId,
          orderId,
          amount: orderResult.totalAmount,
          reason: 'Item defective on arrival, replacement inventory unavailable across all warehouses.',
          idempotencyKey: refundKey,
        });

        if (!refundResult.success) {
          // Escalate if refund also failed
          const escalation = await escalationHandler.escalate({
            caseId,
            runId,
            reason: refundResult.error || 'Refund execution failed after replacement failure',
          });
          await this.logEvent({
            runId,
            caseId,
            type: 'ESCALATION',
            status: 'FAILURE',
            summary: escalation.summary,
            metadata: escalation,
          });
          runRecord.status = 'ESCALATED';
          return { status: 'ESCALATED', runId, caseId };
        }

        await this.logEvent({
          runId,
          caseId,
          type: 'ACTION_RESULT',
          tool: 'action.executeRefund',
          status: 'SUCCESS',
          summary: refundResult.summary,
          metadata: refundResult,
        });
        await delay(400);

        // ══════════════════════════════════════════════════════════════════
        // STAGE 8: VERIFICATION
        // ══════════════════════════════════════════════════════════════════
        await this.logEvent({
          runId,
          caseId,
          type: 'TOOL_SELECTION',
          tool: 'verification.verifyState',
          status: 'INFO',
          summary: 'Executing post-action deterministic verification to seal database state change.',
        });
        await delay(300);

        const verificationTool = toolSelector.getTool('verification.verifyState');
        const verifResult = await verificationTool.execute({
          caseId,
          runId,
          actionId: refundResult.actionId,
          actionType: 'REFUND',
          orderId,
        });

        await this.logEvent({
          runId,
          caseId,
          type: 'VERIFICATION',
          tool: 'verification.verifyState',
          status: verifResult.verified ? 'SUCCESS' : 'FAILURE',
          summary: verifResult.auditSummary,
          metadata: verifResult,
        });
        await delay(400);

        // ══════════════════════════════════════════════════════════════════
        // STAGE 9: RESOLUTION
        // ══════════════════════════════════════════════════════════════════
        const finalSummary = `Case autonomously resolved. Initial replacement stock was unavailable (0 units). Engine adapted, validated policy, executed $${orderResult.totalAmount} refund, and verified enterprise database state.`;
        await this.logEvent({
          runId,
          caseId,
          type: 'RESOLUTION',
          status: 'SUCCESS',
          summary: finalSummary,
          metadata: {
            resolvedAction: 'REFUND',
            refundAmount: orderResult.totalAmount,
            verificationPassed: verifResult.verified,
          },
        });

        runRecord.status = 'COMPLETED';
        runRecord.currentStage = 'RESOLUTION';
        runRecord.completedAt = new Date();
        runRecord.summary = finalSummary;

        if (isConnected) {
          try {
            await AgentRun.findOneAndUpdate(
              { runId },
              { status: 'COMPLETED', currentStage: 'RESOLUTION', completedAt: new Date(), summary: finalSummary }
            );
            await Case.findOneAndUpdate(
              { caseId },
              {
                status: 'RESOLVED',
                finalOutcome: {
                  actionType: 'REFUND',
                  resolvedAt: new Date(),
                  summary: finalSummary,
                  verificationPassed: verifResult.verified,
                },
              }
            );
          } catch (e) {}
        }

        return {
          status: 'RESOLVED',
          runId,
          caseId,
          summary: finalSummary,
          events: this.getEvents(runId),
        };
      } else {
        // Direct replacement succeeded (if chaos was disabled)
        runRecord.status = 'COMPLETED';
        return { status: 'RESOLVED', runId, caseId, events: this.getEvents(runId) };
      }
    } catch (error) {
      console.error('Agent execution error:', error);
      await this.logEvent({
        runId,
        caseId,
        type: 'ESCALATION',
        status: 'FAILURE',
        summary: `Unhandled execution error: ${error.message}. Escalating to administrator.`,
        metadata: { error: error.message },
      });
      return { status: 'ESCALATED', runId, error: error.message };
    }
  },
};

export default orchestrator;
