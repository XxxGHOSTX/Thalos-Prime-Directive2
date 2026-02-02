const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createLogger } = require('./utils/logger');
const { prometheusMiddleware, metricsEndpoint } = require('./utils/metrics');
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');

// Load environment variables
require('dotenv').config();

const app = express();
const logger = createLogger();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prometheus metrics middleware
if (process.env.ENABLE_METRICS === 'true') {
  app.use(prometheusMiddleware);
}

// Request logging middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);

// Metrics endpoint
if (process.env.ENABLE_METRICS === 'true') {
  app.get('/metrics', metricsEndpoint);
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Thalos Prime Directive 2',
    version: '2.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: process.env.APP_ENV === 'production' 
      ? 'An error occurred processing your request'
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server only if not required as a module
if (require.main === module) {
  const PORT = process.env.APP_PORT || 8080;
  const HOST = process.env.APP_HOST || '0.0.0.0';

  const server = app.listen(PORT, HOST, () => {
    logger.info(`Thalos Prime Directive 2 started on ${HOST}:${PORT}`);
    logger.info(`Environment: ${process.env.APP_ENV || 'development'}`);
    logger.info(`Metrics enabled: ${process.env.ENABLE_METRICS === 'true'}`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

module.exports = app;
