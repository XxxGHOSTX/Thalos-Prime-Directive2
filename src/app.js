const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createLogger } = require('./utils/logger');
const { prometheusMiddleware, metricsEndpoint } = require('./utils/metrics');
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');

require('dotenv').config();

const app = express();
const logger = createLogger();

app.use(helmet());

// CORS is only a browser-origin restriction; it is not authentication.
const appEnv = String(process.env.APP_ENV || 'development').trim().toLowerCase();
const isProduction = ['production', 'prod'].includes(appEnv);
const defaultOrigins = isProduction
  ? ''
  : 'http://localhost:3000,http://127.0.0.1:3000';
const rawAllowedOrigins = process.env.ALLOWED_ORIGINS ?? defaultOrigins;
const allowedOrigins = rawAllowedOrigins
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  throw new Error('ALLOWED_ORIGINS must contain at least one explicit origin.');
}
if (allowedOrigins.includes('*')) {
  throw new Error('Wildcard CORS origins are prohibited; configure exact origins.');
}
const invalidOrigins = allowedOrigins.filter(origin => {
  try {
    const parsed = new URL(origin);
    return !['http:', 'https:'].includes(parsed.protocol)
      || (isProduction && parsed.protocol !== 'https:')
      || parsed.origin !== origin
      || Boolean(parsed.username || parsed.password);
  } catch {
    return true;
  }
});
if (invalidOrigins.length > 0) {
  throw new Error('ALLOWED_ORIGINS must contain exact http:// or https:// origins without paths.');
}
app.use(cors({ origin: allowedOrigins, optionsSuccessStatus: 200 }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (process.env.ENABLE_METRICS === 'true') {
  app.use(prometheusMiddleware);
}

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// All API endpoints require a strong configured bearer token.
// This does not replace HTTPS, network restrictions, or secret rotation.
function requireApiToken(req, res, next) {
  const expected = Buffer.from(process.env.THALOS_API_TOKEN || '', 'utf8');
  if (expected.length < 32) {
    return res.status(503).json({
      error: 'Protected API unavailable',
      message: 'Configure a strong THALOS_API_TOKEN through a secure runtime environment.'
    });
  }

  const authorization = req.get('authorization') || '';
  const separator = authorization.indexOf(' ');
  const scheme = separator >= 0 ? authorization.slice(0, separator) : '';
  const supplied = Buffer.from(separator >= 0 ? authorization.slice(separator + 1) : '', 'utf8');

  if (
    scheme.toLowerCase() !== 'bearer'
    || supplied.length !== expected.length
    || !crypto.timingSafeEqual(supplied, expected)
  ) {
    return res.status(401).set('WWW-Authenticate', 'Bearer').json({
      error: 'Unauthorized',
      message: 'A valid bearer token is required.'
    });
  }
  return next();
}

// Liveness probes remain public and must not return user or session content.
app.use('/health', healthRoutes);
app.use('/api', requireApiToken, apiRoutes);

if (process.env.ENABLE_METRICS === 'true') {
  app.get('/metrics', requireApiToken, metricsEndpoint);
}

app.get('/', (req, res) => {
  res.json({
    name: 'Thalos Prime Directive 2',
    version: '2.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, _next) => {
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

if (require.main === module) {
  const PORT = process.env.APP_PORT || 8080;
  const HOST = process.env.APP_HOST || '127.0.0.1';
  const server = app.listen(PORT, HOST, () => {
    logger.info(`Thalos Prime Directive 2 started on ${HOST}:${PORT}`);
    logger.info(`Environment: ${process.env.APP_ENV || 'development'}`);
    logger.info(`Metrics enabled: ${process.env.ENABLE_METRICS === 'true'}`);
  });

  const gracefulShutdown = signal => {
    logger.info(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

module.exports = app;
