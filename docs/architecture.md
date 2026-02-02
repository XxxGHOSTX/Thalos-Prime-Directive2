# Architecture Overview

## System Architecture

Thalos Prime Directive 2 is designed as a cloud-native, microservices-ready application with the following architectural principles:

### Core Principles

1. **Containerization First**: All components run in containers for consistency across environments
2. **Horizontal Scalability**: Application can scale across multiple instances
3. **Health-First Design**: Built-in health checks for orchestration platforms
4. **Observability**: Comprehensive logging, metrics, and monitoring
5. **Security by Default**: Security best practices embedded in the architecture

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer / Ingress                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Thalos Prime Service (N instances)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pod 1      │  │   Pod 2      │  │   Pod N      │       │
│  │              │  │              │  │              │       │
│  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │       │
│  │ │App Server│ │  │ │App Server│ │  │ │App Server│ │       │
│  │ │(Port 8080│ │  │ │(Port 8080│ │  │ │(Port 8080│ │       │
│  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │       │
│  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │       │
│  │ │ Metrics  │ │  │ │ Metrics  │ │  │ │ Metrics  │ │       │
│  │ │(Port 9090│ │  │ │(Port 9090│ │  │ │(Port 9090│ │       │
│  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services (Optional)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Database │  │  Cache   │  │   APIs   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Application Layers

### 1. API Layer (`src/routes/`)
- Handles incoming HTTP requests
- Route definitions and request validation
- Rate limiting and CORS handling

### 2. Business Logic Layer
- Application-specific logic
- Data processing and transformation
- Integration with external services

### 3. Utilities Layer (`src/utils/`)
- Logging (Winston)
- Metrics (Prometheus)
- Shared utilities

### 4. Infrastructure Layer
- Health checks
- Metrics collection
- Error handling

## Data Flow

```
Request → Rate Limiter → Security Headers → Request Logger →
Routes → Business Logic → Response → Metrics Collection
```

## Scaling Strategy

### Horizontal Pod Autoscaling (HPA)

The application uses Kubernetes HPA to automatically scale based on:
- CPU utilization (target: 70%)
- Memory utilization (target: 80%)
- Min replicas: 3
- Max replicas: 10

### Resource Allocation

Per Pod:
- **Requests**: 100m CPU, 128Mi Memory
- **Limits**: 500m CPU, 512Mi Memory

## Security Architecture

### Defense in Depth

1. **Network Level**
   - Ingress with TLS termination
   - Network policies for pod-to-pod communication

2. **Application Level**
   - Helmet.js for security headers
   - CORS configuration
   - Rate limiting
   - Input validation

3. **Container Level**
   - Non-root user execution
   - Read-only root filesystem
   - Dropped capabilities
   - Security context constraints

4. **Platform Level**
   - Pod Security Standards
   - Resource quotas
   - Network segmentation

## High Availability

### Redundancy
- Minimum 3 replicas running at all times
- Spread across availability zones (when configured)
- Load balanced traffic distribution

### Health Checks
- **Liveness Probe**: Ensures pod is alive and responsive
- **Readiness Probe**: Ensures pod is ready to accept traffic
- **Startup Probe**: Allows slow-starting containers extra time

### Graceful Shutdown
- Application handles SIGTERM signals
- 10-second grace period for in-flight requests
- Prevents connection drops during deployments

## Monitoring and Observability

### Metrics (Prometheus)
- HTTP request duration
- Request count by endpoint
- Active connections
- System metrics (CPU, memory, etc.)

### Logging (Winston)
- Structured JSON logging in production
- Configurable log levels
- Request/response logging
- Error stack traces

### Health Endpoints
- `/health` - Basic health check
- `/health/ready` - Readiness status
- `/health/live` - Liveness status
- `/metrics` - Prometheus metrics

## Deployment Strategy

### Rolling Updates
- Zero-downtime deployments
- Gradual pod replacement
- Automatic rollback on failure

### Blue-Green Deployments (Optional)
- Full environment duplication
- Traffic switch after validation
- Easy rollback capability

## Technology Stack

- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Logging**: Winston
- **Metrics**: Prometheus (prom-client)
- **Security**: Helmet.js, CORS
- **Testing**: Jest, Supertest

## Future Enhancements

- Service mesh integration (Istio/Linkerd)
- Distributed tracing (Jaeger/Zipkin)
- API Gateway integration
- Database connection pooling
- Caching layer (Redis)
- Message queue integration
- GraphQL API support
