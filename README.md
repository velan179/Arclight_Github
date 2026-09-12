# ResolveFlow 🚀
## Autonomous Customer Resolution Agent (PS5)

> **ResolveFlow** doesn't just tell customers what to do — it investigates across enterprise systems, acts deterministically, observes outcomes, verifies resulting database states, and autonomously recovers when initial solutions fail.

---

## 📚 Documentation Quick Links

| Document | Purpose |
| :--- | :--- |
| 🏗️ [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Complete system architecture, agent loop, and state machine |
| 🔌 [docs/API.md](docs/API.md) | Frozen REST API contracts, request/response formats, and error codes |
| 🗄️ [docs/DATABASE.md](docs/DATABASE.md) | MongoDB collections, Mongoose schemas, and indexes |
| 🎬 [docs/DEMO.md](docs/DEMO.md) | Step-by-step walkthrough of the failure recovery demo scenario |
| 🌿 [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) | Team branching rules, conventional commits, and merge sequence |

---

## 👥 Module Ownership & Team Boundaries

The project is strictly partitioned into **4 major modules**. Team members must work inside their assigned areas to avoid conflicts:

| Member | Module Focus | Primary Scope | Git Branch |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Customer Experience & Case Management** | React UI, Dashboard, Journey Graph, Evidence Inspector | `feature/member-1-ui` |
| **Member 2** | **Autonomous Agent & Replanning Engine** | Agent loop, Tool Selection, Failure Detection, Recovery | `feature/member-2-agent` |
| **Member 3** | **Enterprise Intelligence & Evidence** | Customer, Order, Product, Inventory, and Policy models | `feature/member-3-enterprise` |
| **Member 4** | **Action Execution, Simulation & Verification** | Refund, Replacement, Failure Simulator, State Verification | `feature/member-4-actions` |

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn-compatible primitives, Framer Motion, Lucide React, Axios, TanStack Query
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, Zod
- **Database**: MongoDB / MongoDB Atlas
- **AI / Agent**: Deterministic backend tools as source of truth, structured tool calling, closed-loop state recovery

---

## 🚀 Quick Start Guide

### 1. Environment Setup
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Start Development Servers
```bash
# Start backend server (Port 5000)
npm run dev:server

# Start frontend application (Port 5173)
npm run dev:client

# Or run both concurrently
npm run dev:all
```

---

## 🔒 Shared File Ownership Rule

The following files are **SHARED** and must NOT be independently redesigned:
- `package.json` (root)
- `README.md` (root)
- `.env.example`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/DATABASE.md`
- `docs/GIT_WORKFLOW.md`

Coordinate with the team lead before modifying any shared infrastructure.

---

## 🧪 Official Integration / Merge Order
1. **Member 3** — Enterprise Intelligence (`feature/member-3-enterprise`)
2. **Member 4** — Actions & Verification (`feature/member-4-actions`)
3. **Member 2** — Agent & Replanning (`feature/member-2-agent`)
4. **Member 1** — Frontend Integration (`feature/member-1-ui`)
