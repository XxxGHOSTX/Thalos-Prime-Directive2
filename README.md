# Thalos Prime Directive 2

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen.svg)](Dockerfile)
[![Production Ready](https://img.shields.io/badge/Production-Ready-success.svg)]()

A production-ready, cloud-native application framework designed for scalability, reliability, and ease of deployment.

## 🚀 Features

- **Production-Ready Infrastructure**: Complete deployment setup with Docker and Kubernetes
- **CI/CD Pipeline**: Automated testing and deployment workflows
- **Health Monitoring**: Built-in health checks and monitoring endpoints
- **Security First**: Security best practices and vulnerability scanning
- **Cloud-Native**: Designed for containerized environments
- **Scalable Architecture**: Horizontal scaling support
- **Comprehensive Documentation**: Detailed guides for setup and deployment

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+ (for local development)
- Kubernetes 1.20+ (for production deployment)
- kubectl configured (for Kubernetes deployment)

## 🏗️ Project Structure

```
.
├── src/                    # Application source code
├── tests/                  # Test files
├── config/                 # Configuration files
├── k8s/                    # Kubernetes manifests
├── docs/                   # Documentation
├── .github/workflows/      # CI/CD workflows
├── Dockerfile              # Container definition
├── docker-compose.yml      # Local development setup
└── README.md               # This file
```

## 🚀 Quick Start

### Local Development with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/XxxGHOSTX/Thalos-Prime-Directive2.git
   cd Thalos-Prime-Directive2
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Start the application:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Application: http://localhost:8080
   - Health Check: http://localhost:8080/health

### Production Deployment with Kubernetes

1. Build and push the Docker image:
   ```bash
   docker build -t thalos-prime:latest .
   docker tag thalos-prime:latest your-registry/thalos-prime:latest
   docker push your-registry/thalos-prime:latest
   ```

2. Update the image in Kubernetes manifests:
   ```bash
   # Edit k8s/deployment.yaml to use your image
   ```

3. Deploy to Kubernetes:
   ```bash
   kubectl apply -f k8s/
   ```

4. Verify deployment:
   ```bash
   kubectl get pods -l app=thalos-prime
   kubectl get services thalos-prime
   ```

## 🔧 Configuration

Configuration is managed through environment variables. See `.env.example` for all available options.

Key configuration parameters:

- `APP_ENV`: Application environment (development, staging, production)
- `APP_PORT`: Application port (default: 8080)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `ENABLE_METRICS`: Enable Prometheus metrics (true/false)

## 📊 Monitoring & Health Checks

### Health Check Endpoints

- `/health`: Basic health check
- `/health/ready`: Readiness probe
- `/health/live`: Liveness probe
- `/metrics`: Prometheus metrics (if enabled)

### Monitoring

The application exposes Prometheus-compatible metrics on the `/metrics` endpoint. Configure your monitoring system to scrape this endpoint.

## 🧪 Testing

Run tests locally:

```bash
# Unit tests
docker-compose run --rm app npm test

# Integration tests
docker-compose run --rm app npm run test:integration

# All tests
docker-compose run --rm app npm run test:all
```

## 🔒 Security

- See [SECURITY.md](SECURITY.md) for security policies and reporting vulnerabilities
- Container images are scanned for vulnerabilities in CI/CD pipeline
- Follow security best practices outlined in the documentation

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation

Detailed documentation is available in the [docs/](docs/) directory:

- [Architecture Overview](docs/architecture.md)
- [Deployment Guide](docs/deployment.md)
- [Configuration Reference](docs/configuration.md)
- [API Documentation](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🆘 Support

- Create an [Issue](https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/issues) for bug reports or feature requests
- Check [docs/troubleshooting.md](docs/troubleshooting.md) for common issues

## 🌟 Acknowledgments

Built with best practices from the cloud-native community.