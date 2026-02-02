# API Documentation

## Overview

Thalos Prime Directive 2 provides a RESTful API for application interaction and monitoring.

Base URL: `http://localhost:8080` (development)

## Authentication

Currently, the API does not require authentication. In production, implement authentication based on your requirements:
- API Keys
- JWT Tokens
- OAuth 2.0

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Window**: 15 minutes (configurable)
- **Max Requests**: 100 per IP (configurable)
- **Response**: 429 Too Many Requests when exceeded

## Response Format

All responses are in JSON format with consistent structure:

**Success Response:**
```json
{
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error Type",
  "message": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Root Endpoint

#### GET /

Returns basic application information.

**Response:**
```json
{
  "name": "Thalos Prime Directive 2",
  "version": "2.0.0",
  "status": "operational",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Success

**Example:**
```bash
curl http://localhost:8080/
```

---

### Health Check Endpoints

#### GET /health

Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

**Status Codes:**
- `200 OK`: Application is healthy

**Example:**
```bash
curl http://localhost:8080/health
```

---

#### GET /health/ready

Readiness probe endpoint. Checks if application is ready to serve traffic.

**Response:**
```json
{
  "status": "ready",
  "checks": {
    "server": "ok",
    "database": "ok",
    "cache": "ok"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Application is ready
- `503 Service Unavailable`: Application is not ready

**Example:**
```bash
curl http://localhost:8080/health/ready
```

---

#### GET /health/live

Liveness probe endpoint. Checks if application is alive.

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "pid": 1234,
  "memory": {
    "rss": 12345678,
    "heapTotal": 12345678,
    "heapUsed": 12345678,
    "external": 12345678
  }
}
```

**Status Codes:**
- `200 OK`: Application is alive

**Example:**
```bash
curl http://localhost:8080/health/live
```

---

### API Endpoints

#### GET /api/status

Returns API operational status.

**Response:**
```json
{
  "api": "operational",
  "version": "2.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200 OK`: API is operational

**Example:**
```bash
curl http://localhost:8080/api/status
```

---

#### GET /api/info

Returns detailed application information.

**Response:**
```json
{
  "name": "Thalos Prime Directive 2",
  "description": "Production-ready cloud-native application",
  "features": [
    "Health monitoring",
    "Prometheus metrics",
    "Docker containerization",
    "Kubernetes deployment",
    "Security best practices"
  ],
  "documentation": "https://github.com/XxxGHOSTX/Thalos-Prime-Directive2"
}
```

**Status Codes:**
- `200 OK`: Success

**Example:**
```bash
curl http://localhost:8080/api/info
```

---

#### POST /api/echo

Echo endpoint for testing. Returns the request body.

**Request Body:**
```json
{
  "message": "Hello, Thalos!"
}
```

**Response:**
```json
{
  "received": {
    "message": "Hello, Thalos!"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Success

**Example:**
```bash
curl -X POST http://localhost:8080/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, Thalos!"}'
```

---

### Metrics Endpoint

#### GET /metrics

Prometheus metrics endpoint (when `ENABLE_METRICS=true`).

**Response:**
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/",status_code="200"} 42

# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05",method="GET",route="/",status_code="200"} 40
...
```

**Status Codes:**
- `200 OK`: Success

**Example:**
```bash
curl http://localhost:8080/metrics
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid request data |
| 404 | Not Found - Endpoint doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service not ready |

## Common Error Responses

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Cannot GET /nonexistent",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too Many Requests",
  "message": "Too many requests from this IP, please try again later.",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An error occurred processing your request",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Request Headers

### Recommended Headers

```
Content-Type: application/json
Accept: application/json
User-Agent: YourApp/1.0
```

### CORS Headers

The API supports CORS. Configure allowed origins via `ALLOWED_ORIGINS` environment variable.

## Response Headers

All responses include:

```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Pagination

For endpoints that support pagination (future enhancement):

**Request:**
```
GET /api/items?page=1&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:8080/health

# API status
curl http://localhost:8080/api/status

# Echo endpoint
curl -X POST http://localhost:8080/api/echo \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

### Using Postman

1. Import the API collection
2. Set base URL to `http://localhost:8080`
3. Test endpoints

### Using HTTPie

```bash
# Health check
http GET localhost:8080/health

# Echo endpoint
http POST localhost:8080/api/echo message="Hello"
```

## API Versioning

Currently v2.0.0 (no version in URL path). Future versions will use:
- URL path versioning: `/api/v2/endpoint`
- Or header versioning: `Accept: application/vnd.thalos.v2+json`

## WebSocket Support

WebSocket support is not currently implemented but can be added for real-time features.

## GraphQL Support

GraphQL support is not currently implemented but can be added as an alternative to REST.

## SDK/Client Libraries

Official client libraries are planned for:
- JavaScript/TypeScript
- Python
- Go
- Java

## API Changelog

### v2.0.0 (Current)
- Initial production-ready API
- Health check endpoints
- Basic API endpoints
- Prometheus metrics
- Rate limiting

## Support

For API questions or issues:
- GitHub Issues: https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/issues
- Documentation: https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/docs
