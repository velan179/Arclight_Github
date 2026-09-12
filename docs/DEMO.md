# ResolveFlow — Primary Demo Scenario (Failure & Autonomous Recovery)

## 1. Scenario Summary
- **Customer**: Sarah Connor (`cust_101`, VIP tier)
- **Order**: MacBook Pro M3 14-inch (`ord_5001`, $1,999.00, Delivered 8 days ago)
- **Customer Goal**: *"My laptop arrived damaged. I want a replacement."*
- **Challenge**: Initial replacement attempt fails due to simulated inventory depletion (0 stock in warehouse).
- **Agentic Recovery**: Agent observes stock failure, re-evaluates policy eligibility for refund, executes refund, verifies financial ledger and order state, and completes case resolution.

---

## 2. Step-by-Step Execution Journey

```
[Step 1: Goal Understanding]
Customer says: "My laptop arrived damaged. I want a replacement."
Agent analyzes intent: Goal = Replace Damaged Hardware, Target Order = ord_5001.

[Step 2: Investigation & Evidence Gathering]
Agent invokes deterministic enterprise tools:
✓ customer.get("cust_101") → Active VIP customer
✓ order.get("ord_5001") → MacBook Pro M3, Delivered Sept 4 (8 days ago)
✓ policy.get("pol_damaged_item") → 30-day window, eligible for replacement & refund
✓ inventory.get("prod_laptop_m3") → Initial warehouse check

[Step 3: Initial Resolution Decision]
Decision: Customer requested replacement, policy permits replacement → Initiate Replacement Order.

[Step 4: Action Execution & Controlled Failure Simulation]
Action: `POST /api/actions/replacement`
Simulator State: Inventory stock updated to 0 (Out of Stock).
Action Result: ✕ FAILED (`INSUFFICIENT_STOCK: Replacement inventory is unavailable`)

[Step 5: Observation & Autonomous Replanning]
Agent observes:
- Mutation failed with `INSUFFICIENT_STOCK`.
- Restock date is 13 days away (outside immediate fulfillment SLA).
Re-plan reasoning:
- Customer is eligible for full refund under 30-day damage policy.
- Alternate recovery pathway: Execute immediate full refund.

[Step 6: Recovery Action Execution]
Action: `POST /api/actions/refund`
Payload: `{ orderId: "ord_5001", amount: 1999.00, reason: "Stock unavailable for replacement" }`
Action Result: ✓ SUCCESS (`Refund act_ref_8821 processed`)

[Step 7: Independent State Verification]
Agent invokes verification engine:
✓ Confirms refund transaction recorded in customer ledger
✓ Confirms order `ord_5001` status changed to `REFUNDED`
✓ Confirms case state updated to `RESOLVED`

[Step 8: Final Outcome Presentation]
Case closed with complete audit trail and live visual timeline in the Agent Journey UI.
```

---

## 3. Judge & Evaluator Verification Checklist

1. **Not a Blind Prompt Chain**: Confirm in backend logs that the agent executed real JavaScript tools and evaluated live database values.
2. **Real Failure Event**: Confirm `AgentEvent` contains a true `FAILURE` event with `status: "FAILURE"` followed by a `REPLAN` event.
3. **Database Consistency**: Check MongoDB `actions` and `verifications` collections to confirm real records were persisted and verified.
4. **UI Transparency**: Confirm the UI timeline shows each step clearly with Apple-clean purple design tokens.
