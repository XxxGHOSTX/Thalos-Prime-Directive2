# Configuration Reference

## Environment Variables

Thalos Prime Directive 2 is configured entirely through environment variables. This document provides a comprehensive reference for all available configuration options.

## Application Configuration

### APP_ENV
- **Description**: Application environment
- **Type**: String
- **Default**: `development`
- **Valid Values**: `development`, `staging`, `production`
- **Example**: `APP_ENV=production`

### APP_NAME
- **Description**: Application name for logging and identification
- **Type**: String
- **Default**: `thalos-prime`
- **Example**: `APP_NAME=thalos-prime`

### APP_PORT
- **Description**: Port the application listens on
- **Type**: Integer
- **Default**: `8080`
- **Example**: `APP_PORT=8080`

### APP_HOST
- **Description**: Host address to bind to
- **Type**: String
- **Default**: `0.0.0.0`
- **Example**: `APP_HOST=0.0.0.0`

## Logging Configuration

### LOG_LEVEL
- **Description**: Minimum log level to output
- **Type**: String
- **Default**: `info`
- **Valid Values**: `error`, `warn`, `info`, `debug`
- **Example**: `LOG_LEVEL=debug`

### LOG_FORMAT
- **Description**: Log output format
- **Type**: String
- **Default**: `json`
- **Valid Values**: `json`, `pretty`
- **Example**: `LOG_FORMAT=json`
- **Note**: Use `json` in production, `pretty` for development

## Monitoring Configuration

### ENABLE_METRICS
- **Description**: Enable Prometheus metrics collection
- **Type**: Boolean
- **Default**: `true`
- **Valid Values**: `true`, `false`
- **Example**: `ENABLE_METRICS=true`

### METRICS_PORT
- **Description**: Port for metrics endpoint
- **Type**: Integer
- **Default**: `9090`
- **Example**: `METRICS_PORT=9090`

## Health Check Configuration

### ENABLE_HEALTH_CHECKS
- **Description**: Enable health check endpoints
- **Type**: Boolean
- **Default**: `true`
- **Valid Values**: `true`, `false`
- **Example**: `ENABLE_HEALTH_CHECKS=true`

### HEALTH_CHECK_TIMEOUT
- **Description**: Timeout for health checks in milliseconds
- **Type**: Integer
- **Default**: `5000`
- **Example**: `HEALTH_CHECK_TIMEOUT=5000`

## Security Configuration

### ENABLE_CORS
- **Description**: Enable Cross-Origin Resource Sharing
- **Type**: Boolean
- **Default**: `true`
- **Valid Values**: `true`, `false`
- **Example**: `ENABLE_CORS=true`

### ALLOWED_ORIGINS
- **Description**: Comma-separated list of allowed CORS origins
- **Type**: String
- **Default**: `*`
- **Example**: `ALLOWED_ORIGINS=https://example.com,https://app.example.com`
- **Note**: Use `*` for development only

### RATE_LIMIT_WINDOW
- **Description**: Time window for rate limiting in milliseconds
- **Type**: Integer
- **Default**: `900000` (15 minutes)
- **Example**: `RATE_LIMIT_WINDOW=900000`

### RATE_LIMIT_MAX_REQUESTS
- **Description**: Maximum requests per IP in the rate limit window
- **Type**: Integer
- **Default**: `100`
- **Example**: `RATE_LIMIT_MAX_REQUESTS=100`

## Database Configuration (Optional)

### DB_HOST
- **Description**: Database host address
- **Type**: String
- **Default**: `localhost`
- **Example**: `DB_HOST=postgres.example.com`

### DB_PORT
- **Description**: Database port
- **Type**: Integer
- **Default**: `5432`
- **Example**: `DB_PORT=5432`

### DB_NAME
- **Description**: Database name
- **Type**: String
- **Example**: `DB_NAME=thalos`

### DB_USER
- **Description**: Database username
- **Type**: String
- **Example**: `DB_USER=thalos_user`

### DB_PASSWORD
- **Description**: Database password
- **Type**: String (Secret)
- **Example**: `DB_PASSWORD=secure_password`
- **Note**: ⚠️ Keep this secret! Never commit to version control

## Cache Configuration (Optional)

### REDIS_HOST
- **Description**: Redis host address
- **Type**: String
- **Default**: `localhost`
- **Example**: `REDIS_HOST=redis.example.com`

### REDIS_PORT
- **Description**: Redis port
- **Type**: Integer
- **Default**: `6379`
- **Example**: `REDIS_PORT=6379`

### REDIS_PASSWORD
- **Description**: Redis password
- **Type**: String (Secret)
- **Example**: `REDIS_PASSWORD=redis_secure_password`
- **Note**: ⚠️ Keep this secret!

## External Services Configuration

### API_KEY
- **Description**: API key for external services
- **Type**: String (Secret)
- **Example**: `API_KEY=your-api-key-here`
- **Note**: ⚠️ Keep this secret!

### API_SECRET
- **Description**: API secret for external services
- **Type**: String (Secret)
- **Example**: `API_SECRET=your-api-secret-here`
- **Note**: ⚠️ Keep this secret!

## Feature Flags

### ENABLE_DEBUG_MODE
- **Description**: Enable debug mode with additional logging
- **Type**: Boolean
- **Default**: `false`
- **Valid Values**: `true`, `false`
- **Example**: `ENABLE_DEBUG_MODE=false`
- **Note**: Never enable in production

### ENABLE_EXPERIMENTAL_FEATURES
- **Description**: Enable experimental features
- **Type**: Boolean
- **Default**: `false`
- **Valid Values**: `true`, `false`
- **Example**: `ENABLE_EXPERIMENTAL_FEATURES=false`

## Configuration by Environment

### Development Configuration

```env
APP_ENV=development
APP_PORT=8080
LOG_LEVEL=debug
LOG_FORMAT=pretty
ENABLE_METRICS=true
ENABLE_DEBUG_MODE=true
```

### Staging Configuration

```env
APP_ENV=staging
APP_PORT=8080
LOG_LEVEL=info
LOG_FORMAT=json
ENABLE_METRICS=true
ENABLE_DEBUG_MODE=false
```

### Production Configuration

```env
APP_ENV=production
APP_PORT=8080
LOG_LEVEL=warn
LOG_FORMAT=json
ENABLE_METRICS=true
ENABLE_DEBUG_MODE=false
ENABLE_EXPERIMENTAL_FEATURES=false
RATE_LIMIT_MAX_REQUESTS=100
```

## Configuration Best Practices

### 1. Security
- ✅ Never commit secrets to version control
- ✅ Use environment-specific secrets
- ✅ Rotate secrets regularly
- ✅ Use secret management tools (Vault, AWS Secrets Manager, etc.)

### 2. Environment Separation
- ✅ Use different configurations for each environment
- ✅ Keep production more restrictive
- ✅ Test configuration changes in staging first

### 3. Documentation
- ✅ Document all custom environment variables
- ✅ Provide example values
- ✅ Note required vs optional variables

### 4. Validation
- ✅ Validate configuration on startup
- ✅ Provide meaningful error messages
- ✅ Use sensible defaults

## Loading Configuration

### Docker Compose

```yaml
environment:
  - APP_ENV=development
  - APP_PORT=8080
  # ... other variables
```

### Kubernetes ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: thalos-prime-config
data:
  APP_ENV: "production"
  APP_PORT: "8080"
  # ... other variables
```

### Kubernetes Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: thalos-prime-secrets
type: Opaque
stringData:
  DB_PASSWORD: "secure_password"
  API_KEY: "your-api-key"
```

### .env File

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

## Configuration Validation

The application validates configuration on startup:

```javascript
// Check required variables
if (!process.env.APP_PORT) {
  console.error('APP_PORT is required');
  process.exit(1);
}

// Validate values
if (process.env.APP_ENV && !['development', 'staging', 'production'].includes(process.env.APP_ENV)) {
  console.error('Invalid APP_ENV value');
  process.exit(1);
}
```

## Troubleshooting Configuration

### Application Won't Start

1. Check all required environment variables are set
2. Verify variable formats (numbers, booleans)
3. Check logs for configuration errors

### Unexpected Behavior

1. Verify environment-specific configuration
2. Check for typos in variable names
3. Ensure boolean values are strings ('true'/'false')

### Security Issues

1. Audit secrets in version control
2. Verify rate limiting is enabled
3. Check CORS configuration in production
4. Ensure debug mode is disabled in production

## Environment Variable Precedence

1. System environment variables (highest priority)
2. .env file
3. Default values in code (lowest priority)

## Dynamic Configuration

Some configurations can be updated without restart:
- Log levels (via API endpoint)
- Feature flags (via API endpoint)

Most configurations require application restart:
- Port numbers
- Host addresses
- Database connections
