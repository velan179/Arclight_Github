# ResolveFlow — Database Design

## Technology

- **Database:** MongoDB 6+
- **ODM:** Mongoose 8+
- **Connection:** Single URI via `MONGODB_URI` environment variable

---

## Collections

### `users`

Stores authenticated users (agents / operators).

```js
{
  _id: ObjectId,
  name: String,          // required
  email: String,         // required, unique
  passwordHash: String,  // bcrypt hash
  role: String,          // "AGENT" | "ADMIN"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `email` (unique)

---

### `cases`

The central document — one document per customer resolution case.

```js
{
  _id: ObjectId,
  customerId: String,        // reference to synthetic customer data
  orderId: String,           // reference to synthetic order data
  customerGoal: String,      // raw customer statement
  status: String,            // see Status Transitions below
  agentRunId: String,        // FK → agentRuns._id
  evidence: [                // retrieved data snapshots
    {
      type: String,          // "CUSTOMER" | "ORDER" | "INVENTORY" | "POLICY"
      data: Mixed,
      retrievedAt: Date
    }
  ],
  decisions: [               // agent decisions
    {
      step: String,          // "PRIMARY" | "ALTERNATIVE"
      action: String,        // "REPLACEMENT" | "REFUND" | "CANCELLATION"
      reasoning: String,     // short human-readable summary (no CoT)
      decidedAt: Date
    }
  ],
  actions: [ObjectId],       // FK → actions._id
  failures: [
    {
      actionType: String,
      reason: String,
      code: String,
      occurredAt: Date
    }
  ],
  replans: [
    {
      from: String,          // action type that failed
      to: String,            // alternative action selected
      reason: String,
      replannedAt: Date
    }
  ],
  verificationResults: [ObjectId],  // FK → verifications._id
  finalOutcome: {
    type: String,            // "REFUND" | "REPLACEMENT" | "CANCELLATION" | "ESCALATED"
    detail: Mixed,
    resolvedAt: Date
  },
  escalationInfo: {
    reason: String,
    escalatedAt: Date,
    escalatedBy: String      // "AGENT"
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `status`, `customerId`, `agentRunId`, `createdAt`

**Status Transitions:**
```
OPEN
 └─► INVESTIGATING
      └─► DECIDING
           └─► ACTION_IN_PROGRESS
                ├─► OBSERVING
                │    ├─► REPLANNING
                │    │    └─► ACTION_IN_PROGRESS (repeat)
                │    └─► VERIFYING
                │         └─► RESOLVED
                └─► VERIFYING
                     └─► RESOLVED
INVESTIGATING ─► ESCALATED
DECIDING      ─► ESCALATED
REPLANNING    ─► ESCALATED
```

---

### `agentRuns`

Tracks one execution of the agent for a case.

```js
{
  _id: ObjectId,
  caseId: ObjectId,       // FK → cases
  status: String,         // "RUNNING" | "COMPLETED" | "FAILED" | "ESCALATED"
  outcome: String,        // "RESOLVED" | "ESCALATED" | "FAILED"
  iterationCount: Number, // how many plan/replan cycles occurred
  startedAt: Date,
  completedAt: Date,
  createdAt: Date
}
```

**Indexes:** `caseId`, `status`

---

### `agentEvents`

Immutable event log — every step of the agent lifecycle.

```js
{
  _id: ObjectId,
  runId: ObjectId,        // FK → agentRuns
  caseId: ObjectId,       // denormalized for quick lookup
  type: String,           // event type (see below)
  tool: String,           // null if not a tool call
  status: String,         // "SUCCESS" | "FAILURE" | "PENDING"
  summary: String,        // human-readable description
  metadata: Mixed,        // tool inputs/outputs, no raw CoT
  timestamp: Date
}
```

**Event Types:**
`GOAL_RECEIVED` | `INVESTIGATION` | `TOOL_SELECTION` | `TOOL_EXECUTION` |
`DECISION` | `ACTION_STARTED` | `ACTION_RESULT` | `FAILURE` |
`OBSERVATION` | `REPLAN` | `VERIFICATION` | `ESCALATION` | `RESOLUTION`

**Indexes:** `runId`, `caseId`, `type`, `timestamp`

---

### `customers` (Synthetic)

Pre-seeded synthetic data. Not a user-facing login system.

```js
{
  _id: ObjectId,
  customerId: String,     // "CUST-001"
  name: String,
  email: String,
  phone: String,
  tier: String,           // "STANDARD" | "PREMIUM" | "VIP"
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  orderHistory: [String], // order IDs
  createdAt: Date
}
```

**Indexes:** `customerId` (unique)

---

### `orders` (Synthetic)

```js
{
  _id: ObjectId,
  orderId: String,        // "ORD-001"
  customerId: String,
  status: String,         // "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  items: [
    {
      productId: String,
      sku: String,
      name: String,
      quantity: Number,
      unitPrice: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: String,  // "CREDIT_CARD" | "DEBIT_CARD" | "WALLET"
  paymentStatus: String,  // "PAID" | "PENDING" | "REFUNDED"
  shippedAt: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `orderId` (unique), `customerId`, `status`

---

### `products` (Synthetic)

```js
{
  _id: ObjectId,
  productId: String,      // "PROD-001"
  sku: String,
  name: String,
  category: String,
  price: Number,
  description: String
}
```

---

### `inventory` (Synthetic + Mutable)

Mutable during demo — the controlled failure simulator sets `available: 0`.

```js
{
  _id: ObjectId,
  productId: String,
  sku: String,
  available: Number,      // set to 0 by failure simulator
  reserved: Number,
  warehouse: String,
  updatedAt: Date
}
```

**Indexes:** `productId` (unique), `sku`

---

### `policies` (Synthetic)

```js
{
  _id: ObjectId,
  policyId: String,       // "POL-001"
  type: String,           // "RETURN" | "REPLACEMENT" | "REFUND" | "CANCELLATION"
  name: String,
  rules: {
    maxDaysAfterDelivery: Number,
    requiresDamageProof: Boolean,
    eligibleTiers: [String],
    maxRefundAmount: Number,
    exceptions: [String]
  },
  active: Boolean,
  createdAt: Date
}
```

---

### `actions`

Records every state-changing action executed.

```js
{
  _id: ObjectId,
  actionId: String,       // unique idempotency key
  caseId: ObjectId,
  orderId: String,
  agentRunId: ObjectId,
  type: String,           // "REFUND" | "REPLACEMENT" | "CANCELLATION"
  status: String,         // "PENDING" | "COMPLETED" | "FAILED"
  request: Mixed,         // input parameters
  result: Mixed,          // output from the action
  idempotencyKey: String, // prevents duplicate execution
  executedAt: Date,
  createdAt: Date
}
```

**Indexes:** `idempotencyKey` (unique), `caseId`, `type`, `status`

---

### `verifications`

Post-action state confirmation records.

```js
{
  _id: ObjectId,
  runId: ObjectId,
  caseId: ObjectId,
  checks: [
    {
      check: String,      // e.g. "order_status"
      expected: String,
      actual: String,
      passed: Boolean
    }
  ],
  verified: Boolean,
  auditId: String,
  verifiedAt: Date,
  createdAt: Date
}
```

---

## Relationships

```
users ─────────────────── (no direct FK, access via JWT)
cases ──────────────────► agentRuns (1:1 per run)
cases ──────────────────► agentEvents (1:many, via runId)
cases ──────────────────► actions (1:many)
cases ──────────────────► verifications (1:many)
customers ──────────────► orders (1:many)
orders ─────────────────► products (many:many via items[])
products ───────────────► inventory (1:1 by productId)
```

---

## Seeding

Member 3 (Enterprise Intelligence) owns the seed script:

```
resolveflow/server/src/models/seed.js
```

Minimum synthetic records:
- 3 customers (STANDARD, PREMIUM, VIP tier)
- 5 orders (various statuses)
- 3 products
- 3 inventory records (one with `available: 0` for failure demo)
- 3 policies (REPLACEMENT, REFUND, CANCELLATION)
