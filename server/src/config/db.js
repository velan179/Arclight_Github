const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${env.MONGODB_URI}`);
    console.warn(`[Database Warning] ${error.message}`);
    console.warn(`[Database] Server will continue running in fallback mode.`);
    return null;
  }
};

module.exports = connectDB;
