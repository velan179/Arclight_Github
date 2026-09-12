# ResolveFlow — API Contract

> ⚠️ **FROZEN CONTRACT** — Do not change endpoint names or response shapes without team-lead approval.  
> All responses use the shared format defined below.

---

## Base URL

```
Development:  http://localhost:5000/api
```

---

## Standard Response Format

### Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### Common Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Authenticated but not allowed |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Action already executed (idempotency) |
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Authentication

### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": { "id": "string", "name": "string", "email": "string" }
  }
}
```

---

### POST /api/auth/login

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": { "id": "string", "name": "string", "email": "string" }
  }
}
```

---

### GET /api/auth/me

Get current authenticated user. Requires `Authorization: Bearer <token>`.

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "string", "name": "string", "email": "string" }
}
```

---

## Health

### GET /api/health

No authentication required.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "service": "resolveflow-api",
    "version": "1.0.0"
  },
  "message": "ResolveFlow API is running"
}
```

---

## Cases

### POST /api/cases

Create a new resolution case.

**Request:**
```json
{
  "customerId": "string",
  "orderId": "string",
  "customerGoal": "string"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "case_abc123",
    "customerId": "string",
    "orderId": "string",
    "customerGoal": "string",
    "status": "OPEN",
    "createdAt": "ISO_DATE"
  }
}
```

---

### GET /api/cases

List all cases (paginated).

**Query params:** `page=1&limit=20&status=OPEN`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "cases": [ { "id": "...", "status": "...", "customerGoal": "..." } ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET /api/cases/:id

Get full case detail.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "case_abc123",
    "customerId": "string",
    "orderId": "string",
    "customerGoal": "string",
    "status": "RESOLVED",
    "agentRunId": "run_xyz",
    "evidence": [],
    "decisions": [],
    "actions": [],
    "failures": [],
    "replans": [],
    "verificationResults": [],
    "finalOutcome": {},
    "escalationInfo": null,
    "createdAt": "ISO_DATE",
    "updatedAt": "ISO_DATE"
  }
}
```

**Case Status Values:** `OPEN` | `INVESTIGATING` | `DECIDING` | `ACTION_IN_PROGRESS` | `OBSERVING` | `REPLANNING` | `VERIFYING` | `RESOLVED` | `ESCALATED`

---

## Agent

### POST /api/agent/run

Start an autonomous agent run for a case.

**Request:**
```json
{
  "caseId": "string"
}
```

**Response 202:**
```json
{
  "success": true,
  "data": {
    "runId": "run_xyz",
    "caseId": "string",
    "status": "RUNNING"
  },
  "message": "Agent run started"
}
```

---

### GET /api/agent/runs/:id

Get agent run status and summary.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "runId": "run_xyz",
    "caseId": "string",
    "status": "COMPLETED",
    "outcome": "RESOLVED",
    "startedAt": "ISO_DATE",
    "completedAt": "ISO_DATE"
  }
}
```

---

### GET /api/agent/runs/:id/events

Get all events for an agent run (the agent journey).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "runId": "run_xyz",
    "events": [
      {
        "runId": "run_xyz",
        "type": "GOAL_RECEIVED",
        "timestamp": "ISO_DATE",
        "tool": null,
        "status": "SUCCESS",
        "summary": "Customer wants replacement for damaged laptop",
        "metadata": {}
      },
      {
        "runId": "run_xyz",
        "type": "TOOL_EXECUTION",
        "timestamp": "ISO_DATE",
        "tool": "inventory.check",
        "status": "SUCCESS",
        "summary": "Checked inventory for LAP-001: 0 units available",
        "metadata": { "productId": "LAP-001", "available": 0 }
      }
    ]
  }
}
```

**Event Types:** `GOAL_RECEIVED` | `INVESTIGATION` | `TOOL_SELECTION` | `TOOL_EXECUTION` | `DECISION` | `ACTION_STARTED` | `ACTION_RESULT` | `FAILURE` | `OBSERVATION` | `REPLAN` | `VERIFICATION` | `ESCALATION` | `RESOLUTION`

---

## Customer

### GET /api/customers/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "cust_001",
    "name": "string",
    "email": "string",
    "tier": "STANDARD | PREMIUM | VIP",
    "orderHistory": []
  }
}
```

---

## Order

### GET /api/orders/:id

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "ord_001",
    "customerId": "string",
    "status": "DELIVERED",
    "items": [ { "productId": "string", "sku": "string", "quantity": 1, "price": 1299.00 } ],
    "paymentMethod": "CREDIT_CARD",
    "totalAmount": 1299.00,
    "deliveredAt": "ISO_DATE"
  }
}
```

---

## Inventory

### GET /api/inventory/:productId

**Response 200:**
```json
{
  "success": true,
  "data": {
    "productId": "string",
    "sku": "string",
    "available": 0,
    "reserved": 3,
    "updatedAt": "ISO_DATE"
  }
}
```

---

## Policy

### GET /api/policies

Get all applicable policies (optionally filtered by type).

**Query params:** `type=RETURN | REPLACEMENT | REFUND`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pol_001",
      "type": "REPLACEMENT",
      "name": "Damaged Item Replacement",
      "rules": {
        "maxDaysAfterDelivery": 30,
        "requiresDamageProof": false,
        "eligibleTiers": ["STANDARD", "PREMIUM", "VIP"]
      }
    }
  ]
}
```

---

## Actions

### POST /api/actions/refund

Execute a refund. **Idempotent** — duplicate requests return the existing refund.

**Request:**
```json
{
  "caseId": "string",
  "orderId": "string",
  "reason": "string",
  "agentRunId": "string"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "actionId": "act_001",
    "type": "REFUND",
    "status": "COMPLETED",
    "refundId": "REF-456",
    "amount": 1299.00,
    "idempotent": false
  }
}
```

---

### POST /api/actions/replacement

Execute a replacement. Validates inventory before executing.

**Request:**
```json
{
  "caseId": "string",
  "orderId": "string",
  "productId": "string",
  "reason": "string",
  "agentRunId": "string"
}
```

**Response 200 (success):**
```json
{
  "success": true,
  "data": {
    "actionId": "act_002",
    "type": "REPLACEMENT",
    "status": "COMPLETED",
    "newOrderId": "ORD-999"
  }
}
```

**Response 409 (out of stock):**
```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Replacement unavailable — inventory is 0"
  }
}
```

---

### POST /api/actions/cancel

Cancel an order.

**Request:**
```json
{
  "caseId": "string",
  "orderId": "string",
  "reason": "string",
  "agentRunId": "string"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "actionId": "act_003",
    "type": "CANCELLATION",
    "status": "COMPLETED",
    "cancelledAt": "ISO_DATE"
  }
}
```

---

## Verification

### POST /api/verification/:runId

Run post-action state verification.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "runId": "string",
    "verified": true,
    "checks": [
      { "check": "order_status", "expected": "REFUNDED", "actual": "REFUNDED", "passed": true }
    ],
    "auditId": "AUD-789"
  }
}
```

---

### GET /api/verification/:runId

Get verification result for a run.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "runId": "string",
    "verified": true,
    "checks": [],
    "auditId": "AUD-789",
    "verifiedAt": "ISO_DATE"
  }
}
```
