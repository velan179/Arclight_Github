# SocraticX — Autonomous Assignment Review & Socratic Tutor

> Don't Give the Answer. Build the Understanding.

SocraticX is an agentic AI-powered assignment review and tutoring platform that helps students identify, understand, and correct mistakes in their assignments without directly revealing the final answer.

Unlike a conventional AI chatbot that simply analyzes an assignment and generates a response, SocraticX operates as a closed-loop autonomous tutoring agent:

Understand → Detect → Verify → Hint → Observe → Adapt → Re-verify → Master

The system supports handwritten mathematics, diagrams, programming assignments, and structured multi-step work.

---

## Table of Contents

- Overview
- Problem Statement
- Our Solution
- Why SocraticX Is Agentic
- Core Agent Workflow
- Key Features
- Supported Assignment Types
- System Architecture
- Technology Stack
- Project Structure
- Agent State Machine
- Tool System
- Socratic Hint Engine
- Verification Engine
- Failure Recovery
- Demo Scenarios
- Database Design
- API Overview
- Security
- Frontend Experience
- Installation
- Environment Variables
- Running the Project
- Production Build
- Testing
- Demo Mode
- Evaluation & Verification
- Agent Audit Trail
- Failure Injection
- Performance & Reliability
- Accessibility
- Future Enhancements
- Project Goals
- Hackathon Alignment
- Contributing
- License
- Acknowledgements

---

# Overview

Traditional assignment tools generally work in one of two ways:

1. They provide a final solution.
2. They provide static feedback.

Both approaches have a major limitation:

> They often solve the problem for the student instead of helping the student discover and correct the mistake.

SocraticX takes a different approach.

The system behaves like an autonomous tutor that:

- understands the student's work,
- identifies potential errors,
- verifies those errors using deterministic tools,
- chooses the smallest useful intervention,
- waits for the student's response,
- evaluates the new attempt,
- adapts the next hint,
- escalates when the student is stuck,
- and independently verifies the final corrected work.

The objective is not simply:

Correct Answer

The objective is:

Student Understanding

---

# Problem Statement

## Autonomous Assignment Review & Socratic Tutor

Build an autonomous assignment-review agent that helps students correct multi-step work without directly revealing the final answer.

The system should:

- receive handwritten mathematics,
- process diagrams,
- analyze programming assignments,
- locate candidate errors,
- verify suspected errors,
- choose the smallest useful intervention,
- observe the student's response,
- adapt its guidance,
- continue until the work is correct,
- or escalate when the student remains stuck,
- and verify the final corrected work.

The important requirement is a closed-loop agentic tutoring workflow.

A single multimodal LLM response is not sufficient.

---

# Our Solution

SocraticX introduces an autonomous tutoring agent capable of repeatedly interacting with:

- the student's assignment,
- the student's attempts,
- mathematical verification tools,
- code execution environments,
- reference knowledge,
- and persistent learning state.

The agent continuously follows:

Student Work
↓
Multimodal Understanding
↓
Assignment Analysis
↓
Error Hypothesis
↓
Independent Verification
↓
Smallest Useful Hint
↓
Student Attempt
↓
Reassessment
↓
Adaptive Guidance
↓
Final Verification
↓
Mastered / Escalated

---

# Why SocraticX Is Agentic

SocraticX is intentionally designed around an agent loop, rather than a fixed prompt chain.

A traditional AI tutor may work like:

Input → LLM → Response

SocraticX works like:

Goal
↓
Reason about current state
↓
Select tool/action
↓
Execute action
↓
Observe result
↓
Update state
↓
Re-plan
↓
Take next action
↓
Verify outcome

The agent maintains persistent state throughout the tutoring session.

---

# Core Agent Workflow

## 1. Receive Assignment

The student can submit:

- image,
- handwritten solution,
- diagram,
- source code,
- text,
- or a combination of these.

## 2. Multimodal Parsing

Gemini analyzes the submission and extracts:

- problem statement,
- student's steps,
- equations,
- code,
- diagram structure,
- assumptions,
- intermediate results,
- final answer,
- and uncertain regions.

The system preserves uncertainty rather than blindly trusting OCR or vision output.

## 3. Error Detection

The agent generates candidate error hypotheses.

Example:

Hypothesis:

The student may have incorrectly distributed
the negative sign in Step 3.

The system does not immediately tell the student.

## 4. Independent Verification

The agent verifies the suspected error using the appropriate tool.

For mathematics:

Symbolic Calculator

For programming:

Code Execution Sandbox

For diagrams:

Geometric / Rule Verification

For assignment references:

Reference Knowledge Base

## 5. Select Smallest Useful Intervention

Instead of immediately explaining everything, SocraticX selects an appropriate hint level.

Example:

Level 1:
"Check the sign in this step."

Level 2:
"Look carefully at how the negative sign was distributed."

Level 3:
"What happens when -3 is multiplied by both terms inside the bracket?"

Level 4:
"Recalculate this transformation before continuing."

Level 5:
"Let's revisit the previous step together."

The final answer is intentionally withheld.

## 6. Observe Student Response

The system waits for the student's next attempt.

It then analyzes:

- whether the mistake was corrected,
- whether the student introduced a new mistake,
- whether the student understood the hint,
- whether the same error persists,
- and whether additional guidance is required.

## 7. Adapt

The agent updates the tutoring strategy.

Student ignored hint
↓
Increase specificity

Student partially corrected
↓
Provide targeted hint

Student repeats same error
↓
Change teaching strategy

Student demonstrates understanding
↓
Reduce intervention

Student remains stuck
↓
Escalate

## 8. Final Verification

The system independently verifies the student's final work.

The LLM is not allowed to simply claim that the answer is correct.

A deterministic verification tool must confirm correctness wherever possible.

---

# Key Features

## Autonomous Agent

The tutoring agent autonomously:

- plans,
- selects tools,
- executes actions,
- observes results,
- updates state,
- adapts,
- and verifies outcomes.

## Handwritten Mathematics

Supports handwritten mathematical work through multimodal analysis.

The system attempts to understand:

- equations,
- arithmetic,
- algebraic transformations,
- calculus steps,
- geometry,
- mathematical notation,
- and intermediate calculations.

## Diagram Analysis

Students can submit diagrams containing:

- geometric shapes,
- angles,
- labels,
- relationships,
- measurements,
- and annotations.

The agent can identify suspicious relationships and guide the student toward correcting them.

## Programming Assignment Review

SocraticX can inspect source code and use a sandbox to verify behavior.

Example:

def add(a, b):
    return a - b

The system may determine that the implementation does not satisfy the intended behavior.

Instead of directly providing the corrected code, the tutor can ask:

"What operation should an add function perform when given two positive numbers?"

## Socratic Hint Engine

The tutor follows a progressive hint strategy.

### Hint Levels

| Level | Purpose |
|---|---|
| 0 | No intervention |
| 1 | Observation |
| 2 | Targeted direction |
| 3 | Conceptual question |
| 4 | Structured guidance |
| 5 | Escalation / guided walkthrough |

The agent always attempts the smallest useful intervention first.

## Independent Verification

Verification can use:

- symbolic calculations,
- code execution,
- deterministic rules,
- reference knowledge,
- assignment rubrics,
- and domain-specific validators.

## Closed-Loop Adaptation

Every student attempt can change the agent's next action.

This prevents the system from behaving like a static chatbot.

## Persistent Learning State

The platform maintains session state including:

- detected concepts,
- mistakes,
- hint history,
- attempts,
- verification results,
- confidence,
- mastery,
- and escalation status.

## Failure Injection

The system includes controlled failure scenarios to demonstrate autonomous recovery.

Examples:

- Gemini timeout,
- symbolic calculator failure,
- code sandbox timeout,
- ambiguous handwriting,
- verification mismatch,
- unsupported input,
- tool failure.

## Complete Audit Trail

Each agent action can be recorded:

Agent Decision
↓
Tool Selected
↓
Tool Execution
↓
Observation
↓
State Update
↓
Next Decision

This makes the system explainable and demonstrable.

---

# Supported Assignment Types

## Mathematics

Examples:

- arithmetic,
- algebra,
- equations,
- factoring,
- inequalities,
- geometry,
- calculus,
- multi-step calculations.

## Programming

Examples:

- Python,
- JavaScript,
- algorithmic exercises,
- function implementation,
- debugging,
- test-driven verification.

## Diagrams

Examples:

- geometry diagrams,
- angle relationships,
- labelled shapes,
- mathematical diagrams.

## Structured Assignments

The system can also process structured text-based assignments containing:

- questions,
- steps,
- reasoning,
- calculations,
- code,
- and final answers.

---

# System Architecture

                    ┌───────────────────────┐
                    │       React UI        │
                    │                       │
                    │ Assignment Workspace  │
                    │ Tutor Chat            │
                    │ Agent Activity        │
                    │ Verification          │
                    │ Progress              │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     Node.js API       │
                    │       Express         │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼────────────────┐
                │               │                │
                ▼               ▼                ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ Gemini Agent │ │ Tool Manager │ │ Session State│
        │              │ │              │ │              │
        │ Multimodal   │ │ Math Tool    │ │ Attempts     │
        │ Reasoning    │ │ Code Sandbox │ │ Hints        │
        │ Planning     │ │ Reference KB │ │ Mastery      │
        └──────────────┘ └──────────────┘ └──────────────┘
                │               │                │
                └───────────────┼────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │       MongoDB         │
                    │                       │
                    │ Users                 │
                    │ Assignments           │
                    │ Sessions              │
                    │ Attempts              │
                    │ Errors                │
                    │ Hints                 │
                    │ Tool Executions       │
                    │ Verification          │
                    │ Learning State        │
                    │ Audit Logs             │
                    └───────────────────────┘

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript / TypeScript
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- Lucide Icons

## Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- HTTP-only Cookies

## Database

- MongoDB
- Mongoose

MongoDB stores:

- users,
- assignments,
- submissions,
- sessions,
- attempts,
- detected errors,
- hints,
- tool executions,
- verification results,
- learning state,
- concepts,
- rubrics,
- audit logs.

## AI

- Google Gemini
- Gemini multimodal understanding
- Gemini structured output
- Gemini function/tool calling

## Verification

### Mathematics

- mathjs
- optional symbolic mathematics integration

### Programming

- Pyodide Web Worker for supported Python execution
- optional Judge0 adapter

### Important Security Principle

Untrusted student code must not be executed using:

eval()

new Function()

node:vm

as a security boundary.

Code execution must occur inside an appropriately isolated sandbox.

---

# Project Structure

socraticx/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── assignment/
│       │   ├── tutor/
│       │   ├── agent/
│       │   ├── verification/
│       │   ├── dashboard/
│       │   └── common/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Assignment.jsx
│       │   ├── Tutor.jsx
│       │   └── DemoCenter.jsx
│       ├── hooks/
│       ├── services/
│       ├── api/
│       ├── utils/
│       ├── types/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── agent/
│   │   ├── gemini/
│   │   ├── tools/
│   │   ├── verification/
│   │   └── tutoring/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
└── README.md

---

# Agent State Machine

The tutoring agent follows a persistent state machine.

CREATED
  ↓
PARSING
  ↓
ANALYZING
  ↓
HYPOTHESIS
  ↓
VERIFYING
  ↓
HINTING
  ↓
AWAITING STUDENT
  ↓
REASSESSMENT
  ↓
 ┌───────────────┐
 │               │
Correct       Incorrect
 │               │
 ↓               ↓
Verification  Adapt Hint
 │               │
 ↓               └──────→ Student Attempt
MASTERED                    ↓
                         Reassessment

---

# Tool System

The agent uses specialized tools instead of relying solely on LLM reasoning.

## Tool Categories

### 1. Math Verification

Used for:

- calculations,
- algebraic transformations,
- equation solving,
- expression comparison.

### 2. Code Verification

Used for:

- executing code,
- testing outputs,
- detecting runtime errors,
- validating expected behavior.

### 3. Reference Knowledge

Used for:

- assignment requirements,
- rubrics,
- concepts,
- known rules,
- expected constraints.

### 4. Diagram Verification

Used for:

- geometric relationships,
- angle constraints,
- mathematical properties,
- consistency checks.

---

# Socratic Hint Engine

The hint engine is one of the core components of SocraticX.

The system should never immediately reveal the final solution unless the escalation policy explicitly permits a guided walkthrough.

## Example

Student:

3(x - 2) = 3x - 2

The agent identifies a possible distribution error.

Instead of saying:

"The correct answer is 3x - 6."

SocraticX responds:

"Look at the multiplication of 3 with every term inside the parentheses. Did both terms receive the same operation?"

If the student still struggles:

"What is 3 × (-2)?"

If the student continues to struggle:

"Let's focus only on the parentheses. Rewrite the multiplication separately for each term."

This maintains the learning objective.

---

# First-Error Principle

When multiple downstream errors exist, SocraticX attempts to locate the earliest causal error.

Example:

Step 1 ✓
Step 2 ✓
Step 3 ✗
Step 4 ✗
Step 5 ✗

Instead of discussing Steps 4 and 5 independently, the system prioritizes Step 3.

This prevents students from receiving unnecessary feedback for errors that are merely consequences of an earlier mistake.

---

# Verification Engine

The final verification stage is deterministic whenever possible.

## Mathematics

Example:

Student:
2 + 2 = 5

The mathematical verification tool independently evaluates the expression.

## Programming

Example:

def add(a, b):
    return a - b

The execution engine can run:

add(2, 3)

and compare the result against the expected behavior.

## Verification Result

The system records a structured result such as:

{
  "verified": true,
  "method": "deterministic",
  "confidence": 0.99,
  "tool": "math-verifier"
}

The exact internal schema may vary by implementation.

---

# Failure Recovery

Agentic systems must handle failures rather than silently breaking.

SocraticX therefore includes recovery strategies.

## Gemini Failure

Gemini Request
↓
Timeout
↓
Retry
↓
Fallback / User-Friendly Error
↓
Resume Session

## Math Tool Failure

Math Tool
↓
Failure
↓
Retry
↓
Alternative verification strategy
↓
Continue / Escalate

## Code Sandbox Timeout

Execution
↓
Timeout
↓
Terminate execution
↓
Record failure
↓
Retry with safe limits
↓
Escalate if necessary

## Ambiguous Handwriting

Low confidence
↓
Ask student to clarify
↓
Receive improved input
↓
Re-parse
↓
Continue agent loop

---

# Demo Scenarios

SocraticX includes deterministic demo scenarios for demonstrating the agentic workflow.

## Scenario 1 — Math Sign Error

Student submits:

3(x - 2) = 3x - 2

Agent:

Detect error
↓
Verify distribution
↓
Identify sign error
↓
Provide smallest useful hint
↓
Student corrects attempt
↓
Reassess
↓
Verify
↓
Mastered

## Scenario 2 — Multi-Step Algebra

Problem:

x² - 5x + 6 = 0

The student makes an error while factoring.

The agent:

1. detects the suspicious step,
2. verifies the transformation,
3. provides a targeted hint,
4. observes the next attempt,
5. adapts if necessary,
6. verifies the final solution.

## Scenario 3 — Programming Error

Student submits:

def add(a, b):
    return a - b

The agent executes tests and detects that the function does not satisfy the intended behavior.

The tutor provides a conceptual hint rather than directly returning the corrected implementation.

## Scenario 4 — Diagram Error

Example:

Triangle:

40° + 60° + 90° = 190°

The agent detects an inconsistency with the triangle angle-sum rule.

It guides the student toward identifying the incorrect value.

## Scenario 5 — Stuck Student

The student repeatedly fails to correct the mistake.

The system progressively increases assistance:

Hint 1
↓
Hint 2
↓
Hint 3
↓
Guided reasoning
↓
Escalation

The session is marked for escalation rather than continuing indefinitely.

---

# Database Design

## User

_id
name
email
passwordHash
role
createdAt
updatedAt

## Assignment

_id
userId
title
description
type
sourceFiles
createdAt
updatedAt

## Submission

_id
assignmentId
sessionId
content
attachments
parsedRepresentation
createdAt

## Session

Stores the persistent agent state:

_id
assignmentId
userId
status
currentStep
detectedErrors
hypotheses
verificationResults
hintHistory
studentAttempts
learningState
escalationState
createdAt
updatedAt

## Attempt

_id
sessionId
content
analysis
detectedChanges
verification
createdAt

## Error

_id
sessionId
location
description
severity
confidence
verified
evidence
status

## Hint

_id
sessionId
level
content
purpose
studentResponse
effectiveness
createdAt

## ToolExecution

_id
sessionId
tool
input
output
status
duration
error
createdAt

## LearningState

_id
userId
concepts
mastery
mistakePatterns
progress
updatedAt

## AuditLog

_id
sessionId
eventType
actor
metadata
timestamp

---

# API Overview

## Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

## Assignments

POST   /api/assignments
GET    /api/assignments
GET    /api/assignments/:id
PATCH  /api/assignments/:id
DELETE /api/assignments/:id

## Submissions

POST /api/submissions
GET  /api/submissions/:id

## Sessions

POST /api/sessions
GET  /api/sessions/:id
POST /api/sessions/:id/attempt
GET  /api/sessions/:id/history

## Agent

POST /api/agent/analyze
POST /api/agent/next-action
POST /api/agent/reassess
POST /api/agent/verify

## Tools

POST /api/tools/math
POST /api/tools/code
POST /api/tools/reference
POST /api/tools/diagram

## Analytics

GET /api/analytics/progress
GET /api/analytics/mastery
GET /api/analytics/mistakes

---

# Security

Security is treated as a core requirement.

## Authentication

The application uses:

- JWT authentication,
- HTTP-only cookies,
- password hashing,
- protected routes.

## Authorization

Users can only access their own:

- assignments,
- sessions,
- attempts,
- learning data,
- analytics.

## Input Validation

All external input is validated.

Recommended validation includes:

- Zod on the frontend,
- schema validation on the backend,
- Mongoose validation,
- file-type validation,
- payload-size limits.

## File Security

Uploaded files should be:

- type validated,
- size limited,
- sanitized,
- stored safely,
- inaccessible to unauthorized users.

## Code Execution Security

Student code must never execute directly inside the main Node.js process.

Avoid using:

eval()

new Function()

vm.runInNewContext()

as the security boundary for untrusted code.

Use a proper isolated execution environment.

---

# Frontend Experience

SocraticX uses a clean, professional light theme.

The interface is designed around clarity rather than unnecessary dashboard complexity.

## Main Areas

### Dashboard

Shows:

- active assignments,
- progress,
- mastered concepts,
- recent sessions,
- learning statistics.

### Assignment Workspace

Contains:

- problem statement,
- uploaded work,
- parsed representation,
- agent status,
- detected issues,
- tutor interaction.

### Tutor Panel

Displays:

Tutor
↓
Current observation
↓
Hint
↓
Student response
↓
Next guidance

### Agent Activity Panel

Shows user-friendly agent actions such as:

✓ Parsed submission

✓ Found a possible issue

✓ Verified using Math Engine

→ Preparing a targeted hint

✓ Student response received

→ Reassessing work

✓ Final solution verified

The interface must not expose private chain-of-thought reasoning.

---

# Agent Transparency

SocraticX should show action-level transparency, not hidden reasoning.

Good examples:

"Analyzing your second step..."

"Checking the calculation..."

"Testing the code..."

"Comparing the result..."

"Updating your next hint..."

Avoid displaying internal chain-of-thought reasoning.

---

# Installation

## Prerequisites

Install:

- Node.js
- npm
- MongoDB
- Git

You also need a Gemini API key.

## Clone Repository

git clone https://github.com/YOUR_USERNAME/socraticx.git

cd socraticx

## Install Backend Dependencies

cd server
npm install

## Install Frontend Dependencies

Open another terminal:

cd client
npm install

---

# Environment Variables

Create:

server/.env

Example:

NODE_ENV=development

PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/socraticx

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=replace_with_a_long_random_secret

CLIENT_URL=http://localhost:5173

For production, use secure secrets and a managed MongoDB deployment.

---

# Running the Project

## Start Backend

cd server
npm run dev

Backend:

http://localhost:5000

## Start Frontend

cd client
npm run dev

Frontend:

http://localhost:5173

---

# Production Build

Build the frontend:

cd client
npm run build

The generated production files will be available in:

client/dist/

Start the backend:

cd server
npm start

---

# Testing

SocraticX should include automated tests for the core agent workflow.

## Unit Tests

Test:

- hint selection,
- error prioritization,
- state transitions,
- validation,
- verification logic,
- mastery calculation.

## Integration Tests

Test:

Assignment
↓
Agent
↓
Tool
↓
Database
↓
Verification

## End-to-End Tests

Test complete student journeys:

Register
↓
Create Assignment
↓
Upload Work
↓
Agent Analysis
↓
Receive Hint
↓
Submit Correction
↓
Reassessment
↓
Final Verification

---

# Demo Mode

The application contains a deterministic Demo Center.

This allows judges and developers to demonstrate the agentic workflow without depending entirely on unpredictable user input.

## Demo Dashboard

Scenario 1
Math Sign Error

Scenario 2
Algebra Factoring Error

Scenario 3
Programming Bug

Scenario 4
Diagram Error

Scenario 5
Stuck Student

Each scenario should visibly demonstrate:

Goal
↓
Decision
↓
Action
↓
Intermediate Result
↓
Adaptation
↓
Final Outcome

---

# Evaluation & Verification

SocraticX evaluates both the student's work and the agent's behavior.

Important metrics include:

## Error Detection Accuracy

Correctly detected errors
-------------------------
Total actual errors

## Verification Accuracy

Measures whether deterministic tools correctly validate the agent's hypotheses.

## Hint Effectiveness

Measures whether the student successfully corrected the issue after receiving a hint.

## Adaptation Rate

Measures whether the system changes its tutoring strategy when a student fails to correct the issue.

## Final Verification Reliability

The final state should only become:

MASTERED

when the final work has passed the appropriate verification process.

---

# Agent Audit Trail

Every important agent action should be logged.

Example:

10:31:01
SESSION_CREATED

10:31:04
SUBMISSION_PARSED

10:31:08
ERROR_HYPOTHESIS_CREATED

10:31:11
MATH_TOOL_EXECUTED

10:31:12
ERROR_VERIFIED

10:31:14
HINT_GENERATED

10:32:05
STUDENT_ATTEMPT_RECEIVED

10:32:09
ATTEMPT_REASSESSED

10:32:12
ERROR_RESOLVED

10:32:15
FINAL_VERIFICATION_COMPLETED

10:32:16
SESSION_MASTERED

This makes the agent's autonomous workflow demonstrable.

---

# Failure Injection

The Demo Center should allow controlled failures.

## Gemini Timeout

Gemini unavailable
↓
Retry
↓
Fallback
↓
Continue session

## Math Tool Failure

Math verification failed
↓
Retry
↓
Alternative verification

## Code Sandbox Timeout

Execution timeout
↓
Terminate
↓
Record failure
↓
Retry safely

## Ambiguous Handwriting

Low parsing confidence
↓
Request clarification
↓
Student uploads clearer image
↓
Re-analysis

## Verification Mismatch

LLM says correct
↓
Deterministic verifier disagrees
↓
Agent re-evaluates
↓
Student receives corrected guidance

This demonstrates that the system does not blindly trust the model.

---

# Performance & Reliability

The system should be designed with:

- asynchronous tool execution,
- request timeouts,
- retry policies,
- rate limiting,
- database indexes,
- pagination,
- caching where appropriate,
- graceful error handling,
- structured logging,
- connection pooling,
- API validation.

---

# Accessibility

SocraticX should support:

- keyboard navigation,
- visible focus states,
- semantic HTML,
- accessible labels,
- sufficient contrast,
- responsive layouts,
- screen-reader-friendly controls,
- reduced-motion preferences.

---

# Responsive Design

The application should work across:

Desktop
Tablet
Mobile

The tutor interaction must remain usable on smaller screens.

---

# Design Principles

## 1. Learning First

Never optimize only for obtaining the final answer.

## 2. Minimal Intervention

Give the smallest useful hint.

## 3. Verify Before Claiming

Do not trust an LLM-generated correctness claim when deterministic verification is possible.

## 4. Adapt Continuously

Every student attempt can modify the next agent action.

## 5. Persistent State

The tutoring agent remembers the current session state.

## 6. Transparent Actions

Users can understand what the system is doing.

## 7. Safe Execution

Untrusted code is isolated.

## 8. Graceful Failure

Tool failures should not destroy the session.

---

# Example Agent Decision

Suppose a student submits:

2x + 5 = 15

2x = 15 + 5

2x = 20

x = 10

The agent detects:

Potential error:
The student moved +5 to the other side
using the wrong operation.

The agent verifies the equation independently.

Instead of directly responding:

x = 5

it provides:

"When moving +5 to the other side of the equation, which operation should you use to keep both sides equivalent?"

Student:

"Subtract 5."

Agent:

"Correct. Now apply that operation to the equation and submit the next step."

The student submits:

2x = 10

The agent verifies:

2x = 10

Then:

x = 5

Final verification passes.

Session:

MASTERED

---

# What Makes SocraticX Different?

Most AI education applications follow:

Question
↓
AI
↓
Answer

SocraticX follows:

Assignment
↓
Understand
↓
Hypothesize
↓
Verify
↓
Intervene
↓
Observe
↓
Adapt
↓
Verify
↓
Mastery

The AI is therefore not simply generating educational content.

It is actively managing a goal-driven tutoring process.

---

# Hackathon Alignment

SocraticX directly demonstrates the required characteristics of an autonomous agent.

## Goal-Driven Execution

Goal:

Help the student correct the assignment without revealing the final answer.

## Tool Interaction

The agent interacts with:

- multimodal AI,
- mathematical verification,
- code execution,
- reference knowledge,
- persistent database state.

## Observation

The agent observes:

- tool results,
- student attempts,
- verification results,
- confidence,
- failures.

## Adaptation

The next action changes based on:

- student progress,
- tool results,
- failed attempts,
- ambiguity,
- verification outcomes.

## Verification

The final result is independently verified.

## Failure Recovery

The system demonstrates recovery from:

- model failures,
- tool failures,
- ambiguous inputs,
- execution failures,
- verification conflicts.

---

# Agentic Workflow Summary

Student submits assignment
↓
Parse multimodal work
↓
Identify error hypothesis
↓
Verify using tools
↓
Select smallest useful hint
↓
Student responds
↓
Reassess attempt
↓
Adapt strategy
↓
Final verify
↓
MASTERED / ESCALATED

---

# Future Enhancements

Potential future improvements include:

- personalized learning paths,
- advanced handwriting recognition,
- more programming languages,
- symbolic geometry verification,
- teacher dashboards,
- assignment authoring,
- rubric-aware grading,
- concept dependency graphs,
- long-term student mastery models,
- voice-based tutoring,
- multilingual tutoring,
- classroom analytics,
- collaborative learning,
- adaptive difficulty,
- LMS integration.

---

# Project Goals

SocraticX aims to create an educational AI that does not simply make students faster at obtaining answers.

Instead, it aims to make students better at:

- reasoning,
- debugging,
- identifying mistakes,
- understanding concepts,
- correcting their own work,
- and developing independent problem-solving skills.

---

# Core Philosophy

> Don't give the answer. Build the understanding.

The best tutor is not the one that solves the problem fastest.

The best tutor is the one that helps the student solve the next problem independently.

---

# Contributing

Contributions are welcome.

## Fork the repository

Create a fork of the project.

## Create a branch

git checkout -b feature/your-feature

## Make your changes

git add .
git commit -m "feat: add your feature"

## Push

git push origin feature/your-feature

Then open a Pull Request.

---

# Development Guidelines

When contributing:

- keep components modular,
- validate API inputs,
- avoid exposing sensitive data,
- write tests for important logic,
- document new APIs,
- maintain accessibility,
- avoid hardcoded secrets,
- never execute untrusted code directly,
- preserve the agent's closed-loop architecture.

---

# License

This project is released under the MIT License.

See:

LICENSE

for details.

---

# Acknowledgements

This project uses:

- React
- Node.js
- Express
- MongoDB
- Mongoose
- Google Gemini
- mathjs
- Pyodide
- and other open-source technologies.

We thank the open-source community and the developers of these technologies.

---

# Final Note

SocraticX is designed to demonstrate that an educational AI system can be more than a chatbot.

It can:

PLAN
↓
ACT
↓
OBSERVE
↓
VERIFY
↓
ADAPT
↓
ACT AGAIN

The result is a closed-loop autonomous tutoring system that continuously works toward one objective:

> Help the student understand and correct their own work.

---

## Built with ❤️ for Agentic AI

**SocraticX**

### Don't Give the Answer. Build the Understanding.
