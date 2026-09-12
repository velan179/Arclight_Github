# ResolveFlow — Frozen API Contract

> **CRITICAL RULE**: All team members must strictly follow these endpoints, parameters, and response structures. Do not rename or alter payloads without team consensus.

---

## 1. Global Standards

### Success Response Format (HTTP 200 / 201)
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error Response Format (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable explanation of the error"
  }
}
```

### Standard Error Codes
- `INVALID_INPUT` — Zod / validation schema violation
- `UNAUTHORIZED` — Missing or invalid JWT token
- `NOT_FOUND` — Entity not found in database
- `STATE_CONFLICT` — Invalid case state transition
- `INSUFFICIENT_STOCK` — Inventory unavailable
- `POLICY_VIOLATION` — Rule engine rejection
- `TOOL_EXECUTION_FAILED` — Internal tool invocation error
- `INTERNAL_SERVER_ERROR` — Unhandled internal exception

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
Create a new user / agent account.
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Alex Agent",
  "email": "alex@resolveflow.io",
  "password": "Password123!",
  "role": "AGENT"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr_01",
      "name": "Alex Agent",
      "email": "alex@resolveflow.io",
      "role": "AGENT"
    }
  },
  "message": "Registration successful"
}
```

### `POST /api/auth/login`
Authenticate existing user.
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "alex@resolveflow.io",
  "password": "Password123!"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr_01",
      "name": "Alex Agent",
      "email": "alex@resolveflow.io",
      "role": "AGENT"
    }
  },
  "message": "Login successful"
}
```

### `GET /api/auth/me`
Retrieve currently logged in user context.
- **Auth**: Required (`Bearer <token>`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "usr_01",
    "name": "Alex Agent",
    "email": "alex@resolveflow.io",
    "role": "AGENT"
  },
  "message": "User profile fetched"
}
```

---

## 3. Case Management Endpoints

### `POST /api/cases`
Create a new customer resolution case.
- **Auth**: Required
- **Request Body**:
```json
{
  "customerId": "cust_101",
  "orderId": "ord_5001",
  "customerGoal": "My laptop arrived damaged. I want a replacement."
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "case_1001",
    "customerId": "cust_101",
    "orderId": "ord_5001",
    "customerGoal": "My laptop arrived damaged. I want a replacement.",
    "status": "OPEN",
    "createdAt": "2026-09-12T10:00:00.000Z",
    "updatedAt": "2026-09-12T10:00:00.000Z"
  },
  "message": "Case created successfully"
}
```

### `GET /api/cases`
List all cases with status filter and pagination.
- **Auth**: Required
- **Query Params**: `?status=OPEN&page=1&limit=20`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "case_1001",
      "customerId": "cust_101",
      "orderId": "ord_5001",
      "customerGoal": "My laptop arrived damaged. I want a replacement.",
      "status": "RESOLVED",
      "createdAt": "2026-09-12T10:00:00.000Z"
    }
  ],
  "message": "Cases retrieved successfully"
}
```

### `GET /api/cases/:id`
Get full details of a single case including its timeline, evidence, and actions.
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "case_1001",
    "customerId": "cust_101",
    "orderId": "ord_5001",
    "customerGoal": "My laptop arrived damaged. I want a replacement.",
    "status": "RESOLVED",
    "agentRunId": "run_9001",
    "evidence": {
      "orderDelivered": true,
      "product": "MacBook Pro M3",
      "returnWindowValid": true,
      "replacementStockAvailable": false
    },
    "decisions": [
      {
        "step": 1,
        "summary": "Initial decision: Request replacement item"
      },
      {
        "step": 2,
        "summary": "Re-planned decision: Replacement out of stock, process full refund"
      }
    ],
    "outcome": {
      "type": "REFUND",
      "amount": 1999.00,
      "verified": true
    },
    "createdAt": "2026-09-12T10:00:00.000Z",
    "updatedAt": "2026-09-12T10:05:00.000Z"
  },
  "message": "Case details retrieved"
}
```

---

## 4. Autonomous Agent Endpoints

### `POST /api/agent/run`
Trigger autonomous execution on a case.
- **Auth**: Required
- **Request Body**:
```json
{
  "caseId": "case_1001",
  "simulateFailure": true
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "runId": "run_9001",
    "caseId": "case_1001",
    "status": "IN_PROGRESS",
    "startTime": "2026-09-12T10:00:01.000Z"
  },
  "message": "Agent execution initiated"
}
```

### `GET /api/agent/runs/:id`
Fetch the current state and summary of an agent run.
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "run_9001",
    "caseId": "case_1001",
    "status": "COMPLETED",
    "replanned": true,
    "recoveryAction": "REFUND",
    "verificationPassed": true,
    "durationMs": 3420
  },
  "message": "Agent run status fetched"
}
```

### `GET /api/agent/runs/:id/events`
Fetch sequential event stream for live journey visualization.
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "runId": "run_9001",
      "type": "GOAL_RECEIVED",
      "timestamp": "2026-09-12T10:00:01.100Z",
      "summary": "Customer requested damaged laptop replacement",
      "status": "SUCCESS",
      "metadata": {}
    },
    {
      "runId": "run_9001",
      "type": "TOOL_EXECUTION",
      "tool": "inventory.check",
      "timestamp": "2026-09-12T10:00:02.000Z",
      "summary": "Checked replacement stock for SKU-MBP-14",
      "status": "SUCCESS",
      "metadata": { "available": 0 }
    },
    {
      "runId": "run_9001",
      "type": "FAILURE",
      "timestamp": "2026-09-12T10:00:02.300Z",
      "summary": "Replacement stock unavailable",
      "status": "FAILURE",
      "metadata": { "error": "STOCK_EMPTY" }
    },
    {
      "runId": "run_9001",
      "type": "REPLAN",
      "timestamp": "2026-09-12T10:00:03.000Z",
      "summary": "Initiated refund pathway as alternate recovery",
      "status": "SUCCESS",
      "metadata": { "alternative": "REFUND" }
    },
    {
      "runId": "run_9001",
      "type": "VERIFICATION",
      "timestamp": "2026-09-12T10:00:04.200Z",
      "summary": "Verified refund credited to customer ledger",
      "status": "SUCCESS",
      "metadata": { "verified": true }
    },
    {
      "runId": "run_9001",
      "type": "RESOLUTION",
      "timestamp": "2026-09-12T10:00:04.500Z",
      "summary": "Case successfully resolved",
      "status": "SUCCESS",
      "metadata": { "finalOutcome": "REFUND_COMPLETED" }
    }
  ],
  "message": "Agent run events fetched"
}
```

---

## 5. Enterprise Intelligence Endpoints

### `GET /api/customers/:id`
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "cust_101",
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.com",
    "tier": "VIP",
    "accountStatus": "ACTIVE",
    "totalOrders": 14
  },
  "message": "Customer details retrieved"
}
```

### `GET /api/orders/:id`
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "ord_5001",
    "customerId": "cust_101",
    "productId": "prod_laptop_m3",
    "productName": "MacBook Pro M3 14-inch",
    "amount": 1999.00,
    "purchaseDate": "2026-09-01T08:00:00.000Z",
    "deliveryDate": "2026-09-04T14:30:00.000Z",
    "deliveryStatus": "DELIVERED"
  },
  "message": "Order details retrieved"
}
```

### `GET /api/inventory/:productId`
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "productId": "prod_laptop_m3",
    "sku": "SKU-MBP-14",
    "stockLevel": 0,
    "warehouseLocation": "WH-US-EAST",
    "restockDate": "2026-09-25T00:00:00.000Z"
  },
  "message": "Inventory details retrieved"
}
```

### `GET /api/policies`
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "pol_damaged_item",
      "name": "Damaged on Arrival Policy",
      "returnWindowDays": 30,
      "replacementAllowed": true,
      "refundAllowed": true,
      "requiresEvidence": true
    }
  ],
  "message": "Policy list retrieved"
}
```

---

## 6. Action Execution Endpoints

### `POST /api/actions/refund`
- **Auth**: Required
- **Request Body**:
```json
{
  "caseId": "case_1001",
  "orderId": "ord_5001",
  "amount": 1999.00,
  "reason": "Damaged goods - stock unavailable for replacement",
  "idempotencyKey": "idem_ref_1001_v1"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "actionId": "act_ref_8821",
    "type": "REFUND",
    "status": "COMPLETED",
    "amount": 1999.00,
    "timestamp": "2026-09-12T10:00:03.800Z"
  },
  "message": "Refund processed successfully"
}
```

### `POST /api/actions/replacement`
- **Auth**: Required
- **Request Body**:
```json
{
  "caseId": "case_1001",
  "orderId": "ord_5001",
  "productId": "prod_laptop_m3",
  "idempotencyKey": "idem_rep_1001_v1"
}
```
- **Response (Failure Case)**:
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Replacement inventory is unavailable"
  }
}
```

### `POST /api/actions/cancel`
- **Auth**: Required
- **Request Body**:
```json
{
  "caseId": "case_1001",
  "orderId": "ord_5001",
  "reason": "Customer cancellation request"
}
```

---

## 7. Verification Endpoints

### `POST /api/verification/:runId`
Trigger verification of all side-effects and database states for an agent run.
- **Auth**: Required
- **Request Body**: `{}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "runId": "run_9001",
    "verified": true,
    "checkedItems": [
      { "item": "Refund record in ledger", "status": "CONFIRMED" },
      { "item": "Order status updated to REFUNDED", "status": "CONFIRMED" },
      { "item": "Customer balance updated", "status": "CONFIRMED" }
    ],
    "verifiedAt": "2026-09-12T10:00:04.200Z"
  },
  "message": "State verification completed"
}
```

### `GET /api/verification/:runId`
Retrieve existing verification records.
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "runId": "run_9001",
    "verified": true,
    "timestamp": "2026-09-12T10:00:04.200Z"
  },
  "message": "Verification report retrieved"
}
```

---

## 8. Health Endpoint

### `GET /api/health`
- **Auth**: Public
- **Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 12.34,
    "database": "connected"
  },
  "message": "ResolveFlow API is operational"
}
```
