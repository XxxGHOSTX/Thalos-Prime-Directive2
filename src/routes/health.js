const express = require('express');
const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.APP_ENV || 'development'
  });
});

// Readiness probe
router.get('/ready', (req, res) => {
  // Check if the application is ready to serve traffic
  // Add checks for database connections, external services, etc.
  const checks = {
    server: 'ok',
    // database: checkDatabase(),
    // cache: checkCache(),
  };

  const isReady = Object.values(checks).every(status => status === 'ok');

  if (isReady) {
    res.json({
      status: 'ready',
      checks,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      checks,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness probe
router.get('/live', (req, res) => {
  // Check if the application is alive
  // This should be a lightweight check
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    pid: process.pid,
    memory: process.memoryUsage()
  });
});

module.exports = router;
