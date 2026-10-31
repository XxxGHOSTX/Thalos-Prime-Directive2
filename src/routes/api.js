const express = require('express');
const router = express.Router();

// Example API endpoint
router.get('/status', (req, res) => {
  res.json({
    api: 'operational',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Example data endpoint
router.get('/info', (req, res) => {
  res.json({
    name: 'Thalos Prime Directive 2',
    description: 'Development-stage API service with configurable access controls',
    features: [
      'Health monitoring',
      'Prometheus metrics',
      'Docker containerization',
      'Kubernetes deployment',
      'Bearer-token protected API routes'
    ],
    documentation: 'https://github.com/XxxGHOSTX/Thalos-Prime-Directive2'
  });
});

// Echo endpoint for testing
router.post('/echo', (req, res) => {
  res.json({
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
