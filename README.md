# ResolveFlow 🚀
## Autonomous Customer Resolution Agent

> ResolveFlow doesn't just tell customers what to do — it investigates, acts across enterprise systems, verifies the outcome, and autonomously recovers when its first solution fails.

ResolveFlow is an autonomous customer-resolution platform designed to handle customer support cases from understanding the customer's goal to executing and verifying the final resolution.

Unlike traditional customer-support chatbots that only generate responses, ResolveFlow can:

- Understand the customer's objective
- Investigate customer, order, inventory, and policy data
- Decide the best available resolution
- Execute actions such as refunds, replacements, or cancellations
- Observe the result of its actions
- Detect failures and changing system conditions
- Re-plan autonomously
- Verify the final system state
- Escalate only when autonomous resolution is not safely possible

# 🎯 Problem Statement

### Autonomous Customer Resolution Agent

Customer support systems often require human agents to manually investigate orders, policies, inventory, and customer information before performing actions such as refunds or replacements.

The objective of ResolveFlow is to create an autonomous agent capable of completing the resolution workflow while adapting to failures and changing system conditions.

The agent operates through simulated enterprise tools including:

- Customer database
- Order management
- Inventory system
- Policy knowledge base
- Refund system
- Replacement system
- Cancellation system
- Verification system

# 💡 Our Solution

ResolveFlow transforms a customer request into an autonomous resolution workflow.

Traditional Support:

Customer → Support Agent → Manual Investigation → Decision → Action → Manual Verification

ResolveFlow:

Customer Goal
      ↓
Understand Goal
      ↓
Investigate Enterprise Data
      ↓
Evaluate Policies & Constraints
      ↓
Select Best Resolution
      ↓
Execute Action
      ↓
Observe Result
      ↓
Action Failed?
      ↓
Analyze Failure
      ↓
Re-plan
      ↓
Alternative Action
      ↓
Verify
      ↓
Final Resolution

# 🤖 Agentic Workflow

ResolveFlow follows a closed-loop autonomous decision process:

GOAL
 ↓
INVESTIGATE
 ↓
DECIDE
 ↓
ACT
 ↓
OBSERVE
 ↓
VERIFY
 ↓
SUCCESS → RESOLVE
   │
   └── FAILURE
          ↓
       ADAPT
          ↓
       RE-PLAN
          ↓
       ACT AGAIN
          ↓
       VERIFY

The important difference is that the agent does not follow a fixed sequence blindly.

It observes the result of each action and determines what should happen next.

# 🔥 Key Features

## 1. Autonomous Case Understanding

The agent receives a customer request and determines:

- What the customer wants
- Which order is involved
- What resolution is being requested
- What information must be retrieved
- What constraints apply

Example:

Customer:
"My laptop arrived damaged. I need a replacement."

Agent Goal:
Resolve damaged-product case.

Required investigation:
✓ Customer
✓ Order
✓ Product
✓ Warranty/return policy
✓ Replacement inventory

## 2. Enterprise Intelligence

The agent can interact with simulated enterprise systems.

Customer System:
- Customer profile
- Account status
- Previous cases
- Eligibility information

Order System:
- Order details
- Product
- Order status
- Purchase date
- Delivery status

Inventory System:
- Product availability
- Warehouse stock
- Alternative products
- Replacement availability

Policy System:
- Return eligibility
- Refund eligibility
- Replacement eligibility
- Time limits
- Restrictions

## 3. Evidence-Based Decision Making

The agent does not make decisions based only on the customer's message.

It builds an evidence set from enterprise systems.

Example:

Customer Goal:
Damaged Laptop Replacement

Evidence:
├── Order delivered: YES
├── Product: Laptop X
├── Damage reported: YES
├── Return window: VALID
├── Replacement policy: ELIGIBLE
└── Replacement stock: AVAILABLE

Decision:
Replacement is the preferred resolution.

The UI exposes decision evidence and safe reasoning summaries, rather than hidden chain-of-thought.

## 4. Autonomous Action Execution

After selecting a resolution, the agent can execute permitted actions.

Supported actions:

- Refund
- Replacement
- Cancellation

Each action is executed through controlled backend tools.

Example:

Decision:
Replacement

Action:
Create replacement request

System Result:
FAILED

Reason:
Replacement inventory unavailable

The failure becomes an observation that the agent can use for its next decision.

## 5. Autonomous Failure Recovery 🔄

This is one of the core features of ResolveFlow.

The agent is intentionally tested against changing conditions.

Example:

Customer:
"My laptop arrived damaged. Please replace it."

Agent:
1. Investigate order
2. Check policy
3. Check inventory
4. Select replacement
5. Execute replacement

Then the simulated inventory system changes:

Replacement stock:
0

The replacement fails.

Instead of simply returning:
"Replacement unavailable."

ResolveFlow performs:

Action Failed
      ↓
Observe Failure
      ↓
Investigate Alternative
      ↓
Check Refund Eligibility
      ↓
Re-plan
      ↓
Execute Refund
      ↓
Verify Refund
      ↓
Resolve Case

This demonstrates agentic adaptation.

## 6. Controlled Failure Simulator 🧪

ResolveFlow includes a controlled simulation environment for testing autonomous behavior.

The environment can simulate:

- Replacement unavailable
- Refund temporarily blocked
- Inventory changed
- Policy restriction
- Action failure
- Verification mismatch
- Tool timeout
- Missing information

This allows the system to demonstrate that the agent can adapt instead of simply following a predetermined happy path.

## 7. Live Agent Journey

The frontend provides a real-time visualization of the agent's progress.

Example:

✓ Goal understood
✓ Customer retrieved
✓ Order retrieved
✓ Policy checked
✓ Inventory checked
✓ Replacement selected
✕ Replacement unavailable
↻ Failure detected
↻ Searching alternative resolution
✓ Refund eligibility confirmed
✓ Refund executed
✓ Final state verified
✓ Case resolved

This allows judges to visually observe the complete autonomous workflow.

## 8. Verification Engine

Every important action is followed by verification.

The agent does not assume that an API response means the operation actually succeeded.

Example:

Action:
Refund customer

↓

Refund API:
SUCCESS

↓

Verification:
Refund status = COMPLETED

↓

Final Outcome:
CASE RESOLVED

## 9. Escalation

Autonomy does not mean blindly performing actions.

If the system determines that safe autonomous resolution is not possible, it escalates the case.

Example:

Customer Request
      ↓
Investigation
      ↓
Policy Conflict
      ↓
No Safe Resolution
      ↓
ESCALATE

The case history clearly records why escalation occurred.

## 10. Persistent Case State

Every customer case maintains its resolution state.

A case can contain:

- Customer Goal
- Customer
- Order
- Current Status
- Agent Run
- Tool Events
- Evidence
- Decisions
- Actions
- Failures
- Replans
- Verification Results
- Final Outcome

This allows the agent to maintain state throughout the resolution lifecycle.

# 🏗️ System Architecture

                    ┌──────────────────────┐
                    │      React UI        │
                    │                      │
                    │ Dashboard             │
                    │ Case Management       │
                    │ Agent Journey         │
                    │ Evidence              │
                    │ Resolution History    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js / Express  │
                    │                      │
                    │ Case Management       │
                    │ Agent Orchestrator    │
                    │ Tool Registry         │
                    │ Verification          │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │   Customer  │ │    Order    │ │  Inventory  │
        │   System    │ │   System    │ │   System    │
        └─────────────┘ └─────────────┘ └─────────────┘
                 │             │             │
                 └─────────────┼─────────────┘
                               ▼
                     ┌──────────────────┐
                     │   Policy Engine  │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ Action Services  │
                     │                  │
                     │ Refund           │
                     │ Replacement      │
                     │ Cancellation     │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ Verification     │
                     │ Engine           │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │     MongoDB      │
                     │ Persistent State │
                     └──────────────────┘

# 🧠 Agent Architecture

The agent is implemented as an orchestration loop rather than a fixed prompt chain.

                    ┌───────────────┐
                    │   Case Goal   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Goal Analysis │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Tool Selection│
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Tool Execution│
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  Observation  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │   Evaluate    │
                    └───────┬───────┘
                            ↓
                  ┌─────────┴─────────┐
                  │                   │
                Success             Failure
                  │                   │
                  ↓                   ↓
             Verify State         Analyze Failure
                  │                   │
                  │                   ↓
                  │                Re-plan
                  │                   │
                  │                   ↓
                  │              New Action
                  │                   │
                  └─────────┬─────────┘
                            ↓
                         Verify
                            ↓
                    Final Resolution

# 🛠️ Technology Stack

Frontend:
- React
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- React Flow
- TanStack Query
- Axios

Backend:
- Node.js
- Express.js
- Mongoose
- JWT Authentication
- bcrypt
- Zod

Database:
- MongoDB
- MongoDB Atlas

AI / Agent:
- LLM-powered decision and tool selection
- Node.js agent orchestrator
- Structured tool calling
- Persistent agent run state
- Deterministic enterprise systems and business rules

# 📁 Project Structure

resolveflow/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── context/
│       └── styles/
│
├── server/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       │   ├── agent/
│       │   ├── customer/
│       │   ├── order/
│       │   ├── inventory/
│       │   ├── policy/
│       │   ├── actions/
│       │   └── verification/
│       ├── tools/
│       └── utils/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEMO.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md

# 🔌 API Overview

Authentication:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Cases:
POST /api/cases
GET /api/cases
GET /api/cases/:id

Agent:
POST /api/agent/run
GET /api/agent/runs/:id
GET /api/agent/runs/:id/events

Enterprise Systems:
GET /api/customers/:id
GET /api/orders/:id
GET /api/inventory/:productId
GET /api/policies

Actions:
POST /api/actions/refund
POST /api/actions/replacement
POST /api/actions/cancel

Verification:
POST /api/verification/:runId
GET /api/verification/:runId

# 🔐 Security

ResolveFlow follows secure application practices including:

- JWT-based authentication
- Password hashing with bcrypt
- Input validation using Zod
- Protected API routes
- Environment variables for secrets
- No API keys committed to Git
- Server-side authorization
- Backend validation of all state-changing actions
- Idempotent action handling
- Controlled simulated enterprise environment

# 🧪 Testing

The application is designed to test both successful and failure scenarios.

Scenario 1 — Successful Replacement:

Customer Request
      ↓
Eligible
      ↓
Stock Available
      ↓
Replacement
      ↓
Verification
      ↓
Resolved

Scenario 2 — Replacement Failure:

Customer Request
      ↓
Replacement Selected
      ↓
Inventory Unavailable
      ↓
Failure Observed
      ↓
Re-plan
      ↓
Refund
      ↓
Verification
      ↓
Resolved

Scenario 3 — Unsafe Resolution:

Customer Request
      ↓
Investigation
      ↓
Policy Conflict
      ↓
No Valid Action
      ↓
Escalation

Scenario 4 — Verification Failure:

Action Executed
      ↓
Verification
      ↓
State Mismatch
      ↓
Recovery / Re-verification
      ↓
Final Outcome

# 🎬 Recommended Demo Flow

The demo is designed around the required agentic sequence:

GOAL
 ↓
DECISION
 ↓
ACTION
 ↓
INTERMEDIATE RESULT
 ↓
ADAPTATION
 ↓
FINAL OUTCOME

Demo Scenario:

Step 1 — Goal

Customer submits:

"My laptop arrived damaged. I want a replacement."

Step 2 — Investigation

Agent retrieves:

Customer
Order
Product
Policy
Inventory

Step 3 — Decision

Agent determines:

Customer eligible
+
Replacement allowed
+
Product initially appears available

→ Select Replacement

Step 4 — Action

Agent attempts replacement.

Step 5 — Intermediate Result

Controlled simulator changes inventory:

Replacement unavailable

Action fails.

Step 6 — Adaptation

Agent observes the failure and re-plans.

Replacement unavailable
        ↓
Check refund eligibility
        ↓
Refund available
        ↓
Select Refund

Step 7 — Final Outcome

Agent executes the refund.

Verification confirms:

Refund Status = COMPLETED

Case becomes:

RESOLVED

# 🏆 Why ResolveFlow Is Agentic

ResolveFlow is not a simple chatbot or fixed prompt chain.

The agent demonstrates:

Capability                     ResolveFlow
------------------------------------------------
Goal understanding             YES
Persistent state               YES
Tool interaction               YES
Enterprise data retrieval      YES
Autonomous decision            YES
State-changing actions         YES
Observation                    YES
Failure detection              YES
Re-planning                    YES
Alternative resolution         YES
Verification                   YES
Escalation                     YES
Audit trail                    YES
Controlled failure testing     YES

The system's intelligence comes from the closed-loop interaction between the agent and its environment.

# 📊 Evaluation Alignment

Evaluation Area                     Implementation
---------------------------------------------------------------------------
Agentic Workflow & Autonomy         Goal → Investigate → Decide → Act → Observe → Re-plan
Tool / Environment Interaction     Customer, Order, Inventory, Policy and Action tools
Adaptation & Failure Recovery       Controlled failures + autonomous re-planning
Technical Implementation            React + Node.js + MongoDB + structured services
Problem Relevance & Innovation      Autonomous customer resolution
Prototype Functionality & UX        Live agent journey and case dashboard
Evaluation / Verification            Verification engine, audit logs and failure scenarios

# 🎨 User Experience

ResolveFlow uses a modern AI operations interface.

Design Principles:

- Clean white background
- Light purple primary accent
- Minimal visual noise
- Responsive layout
- Mobile-friendly
- Accessible components
- Clear status indicators
- Real-time agent activity
- Evidence-first interface
- Human-readable error states

The interface is designed to feel like an AI operations control center rather than a traditional customer-support dashboard.

# 📈 Scalability

The architecture is designed so that enterprise tools can be extended without rewriting the agent.

Current Tools:
- Customer
- Order
- Inventory
- Policy
- Refund
- Replacement
- Cancellation

Future Tools:
- Shipping
- Payment
- Fraud Detection
- Loyalty
- Warehouse
- CRM
- Notification
- Escalation

The agent interacts with these capabilities through a structured tool registry.

# 🚀 Future Enhancements

Potential future capabilities include:

- Multi-channel customer support
- Voice-based customer requests
- Multilingual support
- Advanced policy reasoning
- Customer sentiment analysis
- SLA-aware resolution
- Priority-based escalation
- Human-in-the-loop approval
- More enterprise integrations
- Advanced analytics
- Resolution cost optimization
- Learning from historical resolution outcomes

# 👥 Team Architecture

The project is divided into four major modules.

Member 1 — Customer Experience & Case Management

Responsible for:
- React application
- Dashboard
- Case management
- Agent Journey
- Resolution history
- UX and responsiveness

Member 2 — Autonomous Agent & Replanning Engine

Responsible for:
- Agent orchestration
- Goal understanding
- Tool selection
- Decision execution
- Failure detection
- Re-planning
- Escalation
- Persistent agent state

Member 3 — Enterprise Intelligence & Evidence

Responsible for:
- Customer system
- Order system
- Inventory system
- Policy system
- Data retrieval
- Evidence generation
- Synthetic enterprise data

Member 4 — Action Execution, Simulation & Verification

Responsible for:
- Refund
- Replacement
- Cancellation
- State mutation
- Controlled failures
- Verification
- Audit trail
- Idempotency

# 🌿 Git Workflow

The project uses feature branches.

main
│
├── feature/member-1-ui
├── feature/member-2-agent
├── feature/member-3-enterprise
└── feature/member-4-actions

Rules:

1. Never directly push to main.
2. Each member works only on their assigned module.
3. Pull the latest main before merging.
4. Test before creating a pull request.
5. Merge through the team lead.
6. Pull main after every successful merge.
7. Do not modify another member's module without coordination.

# ⚙️ Installation

## 1. Clone Repository

git clone <YOUR_GITHUB_REPOSITORY>
cd resolveflow

## 2. Install Frontend

cd client
npm install

## 3. Install Backend

cd ../server
npm install

## 4. Configure Environment Variables

Create:

server/.env

Example:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
LLM_API_KEY=your_llm_api_key
CLIENT_URL=http://localhost:5173

Never commit .env.

Use .env.example for documenting required variables.

# ▶️ Running Locally

Start Backend:

cd server
npm run dev

Start Frontend:

cd client
npm run dev

The application will be available at the local Vite development URL.

# 🌐 Deployment

Recommended deployment architecture:

Internet
   │
   ▼
Vercel
React Frontend
   │
   ▼
Render / Railway
Node Backend
   │
   ▼
MongoDB Atlas

# 📁 Documentation

Additional project documentation:

docs/
├── ARCHITECTURE.md
├── API.md
└── DEMO.md

ARCHITECTURE.md:
Contains system architecture and component responsibilities.

API.md:
Contains API contracts and request/response structures.

DEMO.md:
Contains the complete hackathon demonstration scenario.

# 🧭 Design Philosophy

ResolveFlow follows three principles:

### 1. Investigate Before Acting

The agent should gather relevant evidence before executing a state-changing action.

### 2. Never Assume Success

Every important action should be verified against the resulting system state.

### 3. Failure Is Feedback

A failed action is not necessarily the end of the workflow.

The agent should:

Failure
  ↓
Understand
  ↓
Adapt
  ↓
Re-plan
  ↓
Act
  ↓
Verify

# 🔮 Vision

Customer support should not be limited to:

"Here is what you should do."

It should become:

"I understood your problem, investigated the relevant systems, selected the best available resolution, executed it, verified the result, and adapted when the environment changed."

That's ResolveFlow.

# 📜 License

This project was developed as part of a hackathon prototype.

All customer, order, inventory, policy, and transaction data used in the demonstration environment is synthetic/simulated.
