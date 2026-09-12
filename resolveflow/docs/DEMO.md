# ResolveFlow — Demo Walkthrough

## Primary Demo Scenario

**Customer Statement:**
> "My laptop arrived damaged. I want a replacement."

---

## Step-by-Step Agent Journey

### 1. GOAL_RECEIVED

The agent receives the customer's free-text goal and case context.

```
Input:
  customerId: CUST-001
  orderId:    ORD-789
  goal:       "My laptop arrived damaged. I want a replacement."

Agent extracts:
  intent:    REPLACEMENT
  productId: LAP-001
  issue:     DAMAGED_ITEM
```

---

### 2. INVESTIGATION

The agent calls enterprise tools in sequence.

| Tool | Result |
|------|--------|
| `customer.get(CUST-001)` | Name: Jane Doe, Tier: PREMIUM, 3 previous orders |
| `order.get(ORD-789)` | Status: DELIVERED 3 days ago, Item: Laptop LAP-001, Paid: ₹89,999 |
| `inventory.check(LAP-001)` | **Available: 0** ← Controlled failure simulator active |
| `policy.check(ORD-789, REPLACEMENT)` | Eligible: YES — within 30 days, PREMIUM tier qualifies |

---

### 3. DECISION (Primary)

```
Evidence:
  ✅ Order delivered 3 days ago (within 30-day window)
  ✅ Customer is PREMIUM tier
  ✅ Policy allows replacement for damaged items
  ⚠️  Inventory for LAP-001 = 0

Decision: REPLACEMENT (primary preference)
```

---

### 4. ACTION_STARTED — Replacement

```
action.replace({
  orderId:   ORD-789,
  productId: LAP-001,
  reason:    "Damaged item - customer reported on delivery"
})
```

---

### 5. FAILURE

```
result: {
  success: false,
  code:    "OUT_OF_STOCK",
  message: "Replacement unavailable — inventory is 0"
}
```

---

### 6. OBSERVATION

```
Agent observes:
  Replacement for LAP-001 cannot be fulfilled.
  Inventory: 0 units available.
  Alternative required.
```

---

### 7. REPLAN

```
Agent re-evaluates:
  policy.check(ORD-789, REFUND)
  → Eligible: YES — same policy window applies

Decision: REFUND (alternative)
Reason:   Replacement stock unavailable; full refund is the
          next best resolution per policy.
```

---

### 8. ACTION_STARTED — Refund

```
action.refund({
  orderId:  ORD-789,
  reason:   "Replacement unavailable — issuing full refund",
  amount:   89999.00
})
```

---

### 9. ACTION_RESULT — Refund Successful

```
result: {
  success:  true,
  refundId: "REF-456",
  amount:   89999.00,
  method:   "CREDIT_CARD",
  eta:      "3-5 business days"
}
```

---

### 10. VERIFICATION

```
verification.run(runId):
  ✅ order.status   = REFUNDED      (expected: REFUNDED)
  ✅ refund.amount  = 89999.00      (expected: 89999.00)
  ✅ action.status  = COMPLETED     (expected: COMPLETED)

auditId: AUD-789
verified: true
```

---

### 11. RESOLUTION

```
Case ORD-789 resolved.
  Outcome: REFUND
  refundId: REF-456
  amount:   ₹89,999
  Customer: Jane Doe notified
```

---

## Frontend Timeline — What the UI Shows

```
● GOAL RECEIVED
  "My laptop arrived damaged. I want a replacement."

● INVESTIGATING
  → Customer data retrieved
  → Order ORD-789 retrieved: DELIVERED 3 days ago
  → Inventory LAP-001: 0 units
  → Policy: Eligible for replacement

● DECISION
  Primary action: REPLACEMENT

● ACTION STARTED
  Attempting replacement for LAP-001...

● FAILURE ⚠️
  OUT_OF_STOCK — Replacement unavailable

● OBSERVATION
  Inventory exhausted. Re-planning required.

● REPLANNING
  Checking refund eligibility...
  Policy: Refund eligible ✅
  Alternative: REFUND selected

● ACTION STARTED
  Executing full refund...

● ACTION RESULT ✅
  Refund REF-456 processed — ₹89,999

● VERIFICATION
  Order status: REFUNDED ✅
  Amount confirmed ✅

● RESOLVED ✅
  Case closed. Refund issued. Customer notified.
```

---

## Escalation Scenario

### Trigger Conditions

The agent escalates when ANY of these are true:

1. Policy blocks ALL resolution types
2. Customer/order data cannot be retrieved after retries
3. Both replacement AND refund fail
4. Verification cannot confirm state after action
5. Agent iteration limit reached (max 3 replan cycles)

### Escalation Example

```
INVESTIGATING
  → policy.check(ORD-789, REPLACEMENT) → Ineligible (>30 days)
  → policy.check(ORD-789, REFUND) → Ineligible (>30 days)
  → policy.check(ORD-789, CANCELLATION) → Ineligible (DELIVERED)

DECISION
  No valid resolution pathway exists.

ESCALATION
  Reason: "All resolution types ineligible per policy (>30 days post-delivery)"
  Human review required.
```

---

## Test Scenarios

| # | Scenario | Expected Outcome |
|---|----------|-----------------|
| 1 | Replacement available | REPLACEMENT → VERIFIED → RESOLVED |
| 2 | Replacement OOS (demo) | REPLACEMENT → FAILURE → REPLAN → REFUND → RESOLVED |
| 3 | Refund fails too | REPLACEMENT → FAILURE → REPLAN → REFUND → FAILURE → ESCALATED |
| 4 | Order outside 30 days | ESCALATED (policy blocks all actions) |
| 5 | Customer not found | ESCALATED (missing information) |
| 6 | Cancellation (pre-delivery) | CANCELLATION → VERIFIED → RESOLVED |
| 7 | Duplicate refund request | Idempotency key — returns existing refund |

---

## Running the Demo

```bash
# 1. Start MongoDB locally
mongod

# 2. Start the server
cd resolveflow/server
npm run dev

# 3. Start the client
cd resolveflow/client
npm run dev

# 4. Open browser
open http://localhost:5173

# 5. Create a case with:
#    Customer ID: CUST-001
#    Order ID: ORD-789 (has LAP-001 with inventory=0)
#    Goal: "My laptop arrived damaged. I want a replacement."

# 6. Click "Run Agent"
# 7. Watch the Agent Journey timeline in real time
```
