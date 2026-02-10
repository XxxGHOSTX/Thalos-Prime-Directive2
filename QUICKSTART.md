# Quick Start Guide

Get Thalos Prime Directive 2 running in under 5 minutes!

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Git installed

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/XxxGHOSTX/Thalos-Prime-Directive2.git
cd Thalos-Prime-Directive2
```

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

That's it! The application is now running.

### 3. Verify It's Working

```bash
# Check health
curl http://localhost:8080/health

# Get application info
curl http://localhost:8080/

# Check API status
curl http://localhost:8080/api/status
```

Expected output:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 10.5,
  "environment": "development"
}
```

### 4. View Logs

```bash
docker-compose logs -f
```

### 5. Stop the Application

```bash
docker-compose down
```

## What You Get

✅ **Running Application** on http://localhost:8080  
✅ **Health Checks** at /health, /health/ready, /health/live  
✅ **Metrics** at http://localhost:9090/metrics  
✅ **API Endpoints** at /api/*  

## Next Steps

### Customize Configuration

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your settings:
   ```bash
   nano .env
   ```

3. Restart:
   ```bash
   docker-compose restart
   ```

### Deploy to Production

See [Deployment Guide](docs/deployment.md) for:
- Kubernetes deployment
- Cloud provider setup (AWS, GCP, Azure)
- CI/CD configuration
- Production best practices

### Run Tests

```bash
npm install
npm test
```

### Build from Source

```bash
# Install dependencies
npm install

# Run locally
npm start

# Development mode (auto-reload)
npm run dev
```

## Common Commands

```bash
# View running containers
docker ps

# View application logs
docker-compose logs -f app

# Restart application
docker-compose restart app

# Execute commands in container
docker-compose exec app sh

# Remove everything
docker-compose down -v
```

## Endpoints Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Application info |
| `/health` | GET | Basic health check |
| `/health/ready` | GET | Readiness probe |
| `/health/live` | GET | Liveness probe |
| `/api/status` | GET | API status |
| `/api/info` | GET | Detailed info |
| `/api/echo` | POST | Echo test endpoint |
| `/metrics` | GET | Prometheus metrics |

## Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:8080/health

# API info
curl http://localhost:8080/api/info

# Echo test
curl -X POST http://localhost:8080/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

### Using HTTPie

```bash
http GET localhost:8080/health
http POST localhost:8080/api/echo message="Hello!"
```

## Troubleshooting

### Port Already in Use

```bash
# Change port in docker-compose.yml
ports:
  - "8081:8080"  # Change 8080 to 8081
```

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Rebuild image
docker-compose build --no-cache
docker-compose up -d
```

### Can't Connect

```bash
# Verify container is running
docker-compose ps

# Check if port is exposed
docker-compose port app 8080
```

## Configuration Quick Reference

Environment variables in `.env`:

```env
# Basic
APP_ENV=development
APP_PORT=8080

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Features
ENABLE_METRICS=true
ENABLE_CORS=true
```

## Resources

- 📖 [Full Documentation](docs/)
- 🏗️ [Architecture](docs/architecture.md)
- 🚀 [Deployment Guide](docs/deployment.md)
- 🔧 [Configuration](docs/configuration.md)
- 📡 [API Reference](docs/api.md)
- 🔍 [Troubleshooting](docs/troubleshooting.md)

## Getting Help

- 📝 [Issues](https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/issues)
- 💬 [Discussions](https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/discussions)
- 📧 Check README for contact information

## What's Next?

1. ✅ Application is running
2. 📖 Read the [Architecture docs](docs/architecture.md)
3. 🔧 Customize your [Configuration](docs/configuration.md)
4. 🚀 Plan your [Deployment](docs/deployment.md)
5. 🤝 Check [Contributing](CONTRIBUTING.md) to get involved

---

**That's it!** You now have a production-ready application running locally. 🎉
