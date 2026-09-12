const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { successResponse } = require('../utils/response');

router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return successResponse(
    res,
    {
      status: 'healthy',
      version: '1.0.0',
      uptime: process.uptime(),
      database: dbState
    },
    'ResolveFlow API is operational'
  );
});

module.exports = router;
