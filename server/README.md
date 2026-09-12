# ResolveFlow — Backend Service

Express.js + Node.js backend powering deterministic tools, LLM agent orchestration, and state persistence for ResolveFlow.

## Directory Layout
```
src/
├── config/             # DB, Environment, App constants
├── middleware/         # Auth, Error handler, Validation, Not found
├── models/             # Mongoose database models
├── routes/             # Express API route declarations
├── controllers/        # Route handlers adhering to common response format
├── services/
│   ├── agent/          # Member 2: Agent loop & recovery engine
│   ├── customer/       # Member 3: Customer intelligence
│   ├── order/          # Member 3: Order inspection
│   ├── inventory/      # Member 3: Inventory checks
│   ├── policy/         # Member 3: Policy evaluation
│   ├── actions/        # Member 4: State mutations (refund/replace/cancel)
│   └── verification/   # Member 4: State verification
├── tools/              # Member 2: Deterministic tool registry
├── validators/         # Zod schemas for input validation
└── utils/              # Uniform response helpers & logger
```

## Setup & Running
```bash
# Install dependencies
npm install

# Start development server with nodemon
npm run dev

# Start in production mode
npm start
```
