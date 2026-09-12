# ResolveFlow — System Architecture

## Overview

ResolveFlow is a full-stack autonomous customer-resolution system built with:

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js 22 + Express 4 |
| Database | MongoDB 6 (Mongoose ODM) |
| Agent LLM | OpenAI GPT-4o-mini (via `openai` npm package) |
| State | MongoDB — single source of truth |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BROWSER (React)                            │
│  Dashboard │ Case List │ Case Detail │ Agent Journey Timeline       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST / SSE
┌──────────────────────────────▼──────────────────────────────────────┐
│                     EXPRESS API SERVER                               │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Auth    │  │   Cases      │  │   Agent      │  │  Actions  │  │
│  │  Routes  │  │   Routes     │  │   Routes     │  │  Routes   │  │
│  └──────────┘  └──────────────┘  └──────┬───────┘  └───────────┘  │
│                                         │                           │
│  ┌──────────────────────────────────────▼───────────────────────┐  │
│  │                   AGENT ORCHESTRATION ENGINE                  │  │
│  │                                                               │  │
│  │  GOAL → INVESTIGATE → DECIDE → ACTION → OBSERVE → REPLAN     │  │
│  │                                                               │  │
│  │  Tools: customer.get │ order.get │ inventory.check            │  │
│  │         policy.check │ action.refund │ action.replace         │  │
│  │         action.cancel │ verification.run │ escalation.trigger  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Enterprise     │  │  Actions     │  │   Verification         │  │
│  │ Services       │  │  Service     │  │   Service              │  │
│  │ (Cust/Order/   │  │  (Refund /   │  │   (State check +       │  │
│  │  Inv/Policy)   │  │   Replace /  │  │    Audit trail)        │  │
│  │                │  │   Cancel)    │  │                        │  │
│  └────────┬───────┘  └──────┬───────┘  └──────────┬────────────┘  │
└───────────┼─────────────────┼──────────────────────┼───────────────┘
            │                 │                       │
┌───────────▼─────────────────▼───────────────────────▼───────────────┐
│                          MONGODB                                     │
│                                                                     │
│   cases  │  agentRuns  │  agentEvents  │  customers  │  orders      │
│   products  │  inventory  │  policies  │  actions  │  auditLogs     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

### Frontend (Member 1 — `feature/member-1-ui`)

| Component | Responsibility |
|-----------|---------------|
| Dashboard | Summary metrics, recent cases |
| Case List | Paginated list of all cases + status |
| Case Detail | Full case view with agent journey timeline |
| Agent Journey | Real-time event stream (GOAL → RESOLVED) |
| Resolution History | Past decisions, actions, verifications |

### Agent Engine (Member 2 — `feature/member-2-agent`)

| Component | Responsibility |
|-----------|---------------|
| Orchestrator | Main agent loop — runs one full resolution cycle |
| Goal Parser | Extracts customer intent + entities from free text |
| Tool Selector | Chooses the correct tool(s) given current observation |
| Planner | Decides next action based on tool results |
| Failure Detector | Identifies when an action has failed |
| Replanner | Selects an alternative path |
| Escalation Handler | Triggers safe escalation when no resolution exists |

### Enterprise Intelligence (Member 3 — `feature/member-3-enterprise`)

| Component | Responsibility |
|-----------|---------------|
| Customer Service | Retrieve customer identity, history, tier |
| Order Service | Retrieve order status, items, shipping, payment |
| Inventory Service | Check product availability by SKU |
| Policy Service | Evaluate eligibility rules (return window, damage policy) |
| MongoDB Models | Mongoose schemas for all enterprise entities |

### Actions & Verification (Member 4 — `feature/member-4-actions`)

| Component | Responsibility |
|-----------|---------------|
| Refund Action | Process refund — idempotent, policy-validated |
| Replacement Action | Process replacement — inventory-validated |
| Cancellation Action | Cancel order — state-validated |
| Failure Simulator | Controlled inventory-zero / API-timeout scenarios |
| Verification Service | Post-action state confirmation + audit trail |

---

## Agent Lifecycle

```
1. GOAL_RECEIVED       Agent receives customer goal + context
2. INVESTIGATION       Agent calls customer / order / product / policy tools
3. TOOL_SELECTION      Agent selects best resolution action
4. DECISION            Agent records reasoning (evidence-based, no CoT exposed)
5. ACTION_STARTED      State-changing action begins
6. ACTION_RESULT       Success or failure returned from action service
7. FAILURE (if any)    Failure recorded with reason
8. OBSERVATION         Agent observes current system state post-action
9. REPLAN              Agent selects alternative resolution
10. VERIFICATION       Agent verifies final system state via verification service
11. RESOLUTION         Case closed with outcome
    — OR —
    ESCALATION         No safe resolution found; human takes over
```

---

## Data Flow — Primary Demo Scenario

```
Customer: "My laptop arrived damaged. I want a replacement."
  │
  ▼ GOAL_RECEIVED
Agent parses: { intent: "replacement", productId: "LAP-001", orderId: "ORD-789" }
  │
  ▼ INVESTIGATION
customer.get(customerId)      → { name, tier, orderHistory }
order.get(orderId)            → { status: "DELIVERED", items, paymentMethod }
inventory.check("LAP-001")   → { available: 0 }   ← CONTROLLED FAILURE
policy.check(orderId, "REPLACEMENT") → { eligible: true, within30Days: true }
  │
  ▼ DECISION
Agent decides: REPLACEMENT (primary) — BUT inventory = 0
  │
  ▼ ACTION_STARTED → action.replace(orderId)
  │
  ▼ FAILURE
replacement.execute() → { success: false, reason: "OUT_OF_STOCK" }
  │
  ▼ OBSERVATION
Agent observes: replacement unavailable
  │
  ▼ REPLAN
policy.check(orderId, "REFUND") → { eligible: true }
Agent selects: REFUND (alternative)
  │
  ▼ ACTION_STARTED → action.refund(orderId)
  │
  ▼ ACTION_RESULT
refund.execute() → { success: true, refundId: "REF-456", amount: 1299.00 }
  │
  ▼ VERIFICATION
verification.run(runId) → { state: "REFUNDED", auditId: "AUD-789" }
  │
  ▼ RESOLVED
Case closed: { outcome: "REFUND", refundId: "REF-456" }
```

---

## Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Backend framework | Express 4 | Lightweight, team familiar, sufficient for hackathon |
| LLM integration | OpenAI SDK (npm) | Same provider as existing workshop, well-documented |
| State persistence | MongoDB | Document model fits agent event streams well |
| Frontend framework | React + Vite | Fast dev server, component ecosystem |
| CSS | Tailwind CSS | Rapid design token enforcement |
| No chain-of-thought storage | Deliberate | Only evidence, decisions, and outcomes stored |
| Idempotency | Action IDs + case state checks | Prevents double refunds / replacements |

---

## Security Constraints

- JWT authentication on all protected routes
- No LLM output trusted for state-changing decisions — backend validates independently
- All secrets in `.env` (never committed)
- Action eligibility validated server-side regardless of frontend state
- Idempotency enforced at the action service layer
