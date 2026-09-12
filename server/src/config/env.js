const dotenv = require('dotenv');
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resolveflow',
  JWT_SECRET: process.env.JWT_SECRET || 'resolveflow_dev_secret_key_change_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  LLM_API_KEY: process.env.LLM_API_KEY || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};

module.exports = env;
