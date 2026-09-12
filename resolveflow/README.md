# ResolveFlow

> **PS5 — Autonomous Customer Resolution Agent**  
> Hackathon project built inside the AI Faculty Workshop Kit starter repository.

---

## What is ResolveFlow?

ResolveFlow is an autonomous customer-resolution agent that investigates, decides, acts, observes failures, re-plans, and verifies — without human intervention unless escalation is required.

**Demo scenario:**  
*"My laptop arrived damaged. I want a replacement."*  
→ Agent investigates → selects Replacement → inventory fails → Agent re-plans → executes Refund → verifies → Resolves.

### Agent Lifecycle

```
GOAL → INVESTIGATE → DECIDE → ACTION → OBSERVE
     ↓                                      ↓
  ESCALATE ←——— REPLAN ←——————————— FAILURE?
                  ↓
             ALTERNATIVE ACTION → VERIFY → RESOLVED
```

---

## Project Structure

```
resolveflow/
├── client/          ← React + Vite frontend  (Member 1)
├── server/          ← Node.js + Express backend
│   └── src/
│       ├── services/agent/       ← Agent orchestration  (Member 2)
│       ├── tools/                ← Agent tools           (Member 2)
│       ├── models/               ← MongoDB models        (Member 3)
│       ├── services/customer/    ← Customer data         (Member 3)
│       ├── services/order/       ← Order data            (Member 3)
│       ├── services/inventory/   ← Inventory data        (Member 3)
│       ├── services/policy/      ← Policy rules          (Member 3)
│       ├── services/actions/     ← Refund/Replace/Cancel (Member 4)
│       └── services/verification/← Verification         (Member 4)
└── docs/            ← Architecture, API, Database, Git docs
```

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| MongoDB | ≥ 6 (local or Atlas) |

### 1. Configure Environment

```bash
cp resolveflow/.env.example resolveflow/server/.env
# Edit resolveflow/server/.env with your values
```

### 2. Start the Backend

```bash
cd resolveflow/server
npm install
npm run dev
```

Health check: `GET http://localhost:5000/api/health`

### 3. Start the Frontend

```bash
cd resolveflow/client
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## Documentation

| Doc | Description |
|-----|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, component responsibilities |
| [API.md](docs/API.md) | Frozen API contract — all endpoints |
| [DATABASE.md](docs/DATABASE.md) | MongoDB collections, schemas, state transitions |
| [DEMO.md](docs/DEMO.md) | Step-by-step demo walkthrough |
| [GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) | Branch strategy, commit conventions, PR process |

---

## Team

| Member | Branch | Module |
|--------|--------|--------|
| Member 1 | `feature/member-1-ui` | Frontend (React/Vite) |
| Member 2 | `feature/member-2-agent` | Agent Orchestration |
| Member 3 | `feature/member-3-enterprise` | Enterprise Intelligence |
| Member 4 | `feature/member-4-actions` | Actions & Verification |
