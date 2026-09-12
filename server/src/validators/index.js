const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'AGENT', 'VIEWER']).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const createCaseSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    orderId: z.string().min(1, 'Order ID is required'),
    customerGoal: z.string().min(5, 'Customer goal must be at least 5 characters')
  })
});

const agentRunSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, 'Case ID is required'),
    simulateFailure: z.boolean().optional()
  })
});

const refundActionSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, 'Case ID is required'),
    orderId: z.string().min(1, 'Order ID is required'),
    amount: z.number().positive('Refund amount must be positive'),
    reason: z.string().optional(),
    idempotencyKey: z.string().optional()
  })
});

const replacementActionSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, 'Case ID is required'),
    orderId: z.string().min(1, 'Order ID is required'),
    productId: z.string().min(1, 'Product ID is required'),
    idempotencyKey: z.string().optional()
  })
});

const cancelActionSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, 'Case ID is required'),
    orderId: z.string().min(1, 'Order ID is required'),
    reason: z.string().optional()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  createCaseSchema,
  agentRunSchema,
  refundActionSchema,
  replacementActionSchema,
  cancelActionSchema
};
