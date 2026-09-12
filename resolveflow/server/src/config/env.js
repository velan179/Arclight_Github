/**
 * env.js — Environment configuration loader
 * Loads and validates required environment variables.
 * Safe defaults ensure the server starts even without MongoDB.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server root
dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/resolveflow',
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },

  llm: {
    apiKey: process.env.LLM_API_KEY ?? '',
    model: process.env.LLM_MODEL ?? 'gpt-4o-mini',
  },

  cors: {
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  },
};

export default config;
