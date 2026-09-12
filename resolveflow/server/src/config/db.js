/**
 * db.js — MongoDB connection via Mongoose.
 * Connection is attempted on startup but is non-fatal for /api/health.
 */

import mongoose from 'mongoose';
import config from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${config.mongodb.uri}`);
  } catch (err) {
    console.warn(`⚠️  MongoDB connection failed: ${err.message}`);
    console.warn('   Server will continue — /api/health will still respond.');
    // Not re-throwing — server stays up without DB
  }
}

export function getConnectionState() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  };
}

export default connectDB;
