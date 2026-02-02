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
    description: 'Production-ready cloud-native application',
    features: [
      'Health monitoring',
      'Prometheus metrics',
      'Docker containerization',
      'Kubernetes deployment',
      'Security best practices'
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
