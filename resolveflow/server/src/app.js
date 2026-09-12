/**
 * app.js — Express application factory.
 * Assembles middleware, routes, and error handling.
 */

import express from 'express';
import cors from 'cors';
import config from './config/env.js';

// Routes
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import casesRouter from './routes/cases.js';
import agentRouter from './routes/agent.js';
import customersRouter from './routes/customers.js';
import ordersRouter from './routes/orders.js';
import inventoryRouter from './routes/inventory.js';
import policiesRouter from './routes/policies.js';
import actionsRouter from './routes/actions.js';
import verificationRouter from './routes/verification.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const app = express();

// ── Core middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: config.cors.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/cases', casesRouter);
app.use('/api/agent', agentRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/verification', verificationRouter);

// ── 404 + error handling (must be last) ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
