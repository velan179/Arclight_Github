# ResolveFlow — Database Architecture & Schemas

ResolveFlow relies on **MongoDB** as its persistent, authoritative source of truth. All data structures are backed by Mongoose models with validation, timestamps, and indexes.

---

## 1. Entity-Relationship Overview

```
┌───────────┐       1:N       ┌───────────┐       1:1       ┌────────────┐
│ Customer  │ ─────────────── │   Case    │ ─────────────── │  AgentRun  │
└───────────┘                 └─────┬─────┘                 └─────┬──────┘
      │                             │                             │
      │ 1:N                         │ 1:N                         │ 1:N
      ▼                             ▼                             ▼
┌───────────┐                 ┌───────────┐                 ┌────────────┐
│   Order   │                 │  Action   │                 │ AgentEvent │
└───────────┘                 └─────┬─────┘                 └────────────┘
      │                             │ 1:1
      │ 1:1                         ▼
┌───────────┐                 ┌──────────────┐
│ Inventory │                 │ Verification │
└───────────┘                 └──────────────┘
```

---

## 2. Core Collections & Schema Specifications

### 2.1 Users (`users`)
Used for customer support agent and administrator authentication.
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // bcrypt hashed
  role: { type: String, enum: ['ADMIN', 'AGENT', 'VIEWER'], default: 'AGENT' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 2.2 Cases (`cases`)
The central entity representing a customer support ticket and its resolution lifecycle.
```javascript
{
  caseNumber: { type: String, unique: true, index: true }, // e.g. CASE-2026-0001
  customerId: { type: String, ref: 'Customer', required: true, index: true },
  orderId: { type: String, ref: 'Order', required: true, index: true },
  customerGoal: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'OPEN',
      'INVESTIGATING',
      'DECIDING',
      'ACTION_IN_PROGRESS',
      'OBSERVING',
      'REPLANNING',
      'VERIFYING',
      'RESOLVED',
      'ESCALATED'
    ],
    default: 'OPEN',
    index: true
  },
  currentRunId: { type: String, ref: 'AgentRun' },
  evidence: { type: mongoose.Schema.Types.Mixed, default: {} },
  decisions: [{
    step: Number,
    summary: String,
    timestamp: { type: Date, default: Date.now }
  }],
  outcome: {
    type: { type: String, enum: ['REFUND', 'REPLACEMENT', 'CANCELLATION', 'ESCALATED', 'NONE'] },
    summary: String,
    amount: Number,
    verified: { type: Boolean, default: false }
  },
  escalationReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 2.3 AgentRuns (`agent_runs`)
Represents an execution instance of the autonomous agent for a specific case.
```javascript
{
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  status: { type: String, enum: ['INITIALIZED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ESCALATED'], default: 'INITIALIZED' },
  replanned: { type: Boolean, default: false },
  failureEncountered: { type: Boolean, default: false },
  failureReason: String,
  recoveryAction: String,
  durationMs: Number,
  startTime: { type: Date, default: Date.now },
  endTime: Date
}
```

### 2.4 AgentEvents (`agent_events`)
Granular stream of events powering the live Agent Journey UI.
```javascript
{
  runId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentRun', required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  type: {
    type: String,
    enum: [
      'GOAL_RECEIVED',
      'INVESTIGATION',
      'TOOL_SELECTION',
      'TOOL_EXECUTION',
      'DECISION',
      'ACTION_STARTED',
      'ACTION_RESULT',
      'FAILURE',
      'OBSERVATION',
      'REPLAN',
      'VERIFICATION',
      'ESCALATION',
      'RESOLUTION'
    ],
    required: true,
    index: true
  },
  tool: String,
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILURE'], default: 'SUCCESS' },
  summary: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now }
}
```

### 2.5 Customers (`customers`)
```javascript
{
  customerId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  tier: { type: String, enum: ['STANDARD', 'GOLD', 'VIP'], default: 'STANDARD' },
  accountStatus: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'FLAGGED'], default: 'ACTIVE' },
  totalOrders: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### 2.6 Orders (`orders`)
```javascript
{
  orderId: { type: String, required: true, unique: true, index: true },
  customerId: { type: String, ref: 'Customer', required: true, index: true },
  productId: { type: String, ref: 'Product', required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PLACED', 'SHIPPED', 'DELIVERED', 'REFUNDED', 'CANCELLED'], default: 'DELIVERED' },
  purchaseDate: { type: Date, required: true },
  deliveryDate: Date,
  createdAt: { type: Date, default: Date.now }
}
```

### 2.7 Inventory (`inventory`)
```javascript
{
  productId: { type: String, required: true, unique: true, index: true },
  sku: { type: String, required: true },
  stockLevel: { type: Number, required: true, default: 0 },
  reservedStock: { type: Number, default: 0 },
  warehouseLocation: String,
  restockDate: Date,
  isSimulatedFailure: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
}
```

### 2.8 Policies (`policies`)
```javascript
{
  policyId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['DAMAGED', 'RETURN', 'CANCELLATION', 'WARRANTY'], required: true },
  returnWindowDays: { type: Number, required: true, default: 30 },
  replacementAllowed: { type: Boolean, default: true },
  refundAllowed: { type: Boolean, default: true },
  requiresEvidence: { type: Boolean, default: true }
}
```

### 2.9 Actions (`actions`)
```javascript
{
  actionId: { type: String, required: true, unique: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  runId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentRun', index: true },
  type: { type: String, enum: ['REFUND', 'REPLACEMENT', 'CANCELLATION'], required: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED', 'REVERTED'], default: 'PENDING' },
  amount: Number,
  details: mongoose.Schema.Types.Mixed,
  idempotencyKey: { type: String, unique: true, sparse: true },
  failureReason: String,
  timestamp: { type: Date, default: Date.now }
}
```

### 2.10 Verifications (`verifications`)
```javascript
{
  runId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentRun', required: true, unique: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  verified: { type: Boolean, required: true },
  checkedItems: [{
    item: String,
    status: { type: String, enum: ['CONFIRMED', 'MISMATCH', 'ERROR'] },
    details: mongoose.Schema.Types.Mixed
  }],
  verifiedAt: { type: Date, default: Date.now }
}
```

---

## 3. Database Indexes

| Collection | Indexed Fields | Purpose |
| :--- | :--- | :--- |
| `cases` | `caseNumber` (unique), `customerId`, `orderId`, `status`, `createdAt` | High-speed case lookups, status filtering |
| `agent_events` | `runId`, `caseId`, `type`, `timestamp` | Rapid sequential timeline retrieval for UI |
| `actions` | `actionId` (unique), `idempotencyKey` (unique sparse), `caseId` | Idempotent state execution |
| `inventory` | `productId` (unique), `sku` | Instant stock checks |
| `customers` | `customerId` (unique), `email` | Customer profile queries |
