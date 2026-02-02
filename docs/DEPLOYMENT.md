# Deployment Guide

This guide covers deploying Thalos Prime to various environments.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)

## Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Quick Start

1. **Clone and configure**
   ```bash
   git clone https://github.com/XxxGHOSTX/Thalos-Prime-Directive2.git
   cd Thalos-Prime-Directive2
   cp .env.example .env
   ```

2. **Set secure passwords**
   Edit `.env` and replace `password` with secure values:
   ```bash
   POSTGRES_PASSWORD=your_secure_password_here
   ```

3. **Build and start**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Verify deployment**
   ```bash
   # Check all services are running
   docker-compose ps
   
   # Check logs
   docker-compose logs -f
   ```

5. **Access services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - PostgreSQL: localhost:5432

### Production Configuration

For production, update `docker-compose.yml`:

```yaml
services:
  postgres:
    restart: always
    # Add volume for persistent data
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
  
  api:
    restart: always
    environment:
      ENVIRONMENT: production
      DEBUG: false
    # Add resource limits
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
  
  web:
    restart: always
    # Add resource limits
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

## Cloud Deployment

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Push images to ECR**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Tag and push
   docker tag thalos-web:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/thalos-web:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/thalos-web:latest
   ```

2. **Set up RDS PostgreSQL**
   - Create PostgreSQL RDS instance
   - Note the endpoint URL
   - Configure security groups

3. **Create ECS Task Definitions**
   - Define tasks for web and api services
   - Set environment variables
   - Configure networking

4. **Deploy with ECS Service**
   - Create ECS cluster
   - Create services from task definitions
   - Configure load balancer

#### Using Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize application**
   ```bash
   eb init -p docker thalos-prime
   ```

3. **Deploy**
   ```bash
   eb create production-env
   eb deploy
   ```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and push to GCR**
   ```bash
   # Configure gcloud
   gcloud auth configure-docker
   
   # Tag and push
   docker tag thalos-web:latest gcr.io/<project-id>/thalos-web:latest
   docker push gcr.io/<project-id>/thalos-web:latest
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy thalos-web \
     --image gcr.io/<project-id>/thalos-web:latest \
     --platform managed \
     --region us-central1 \
     --set-env-vars="DATABASE_URL=<connection-string>"
   ```

### Azure Deployment

#### Using Azure Container Instances

1. **Create resource group**
   ```bash
   az group create --name thalos-rg --location eastus
   ```

2. **Deploy containers**
   ```bash
   az container create \
     --resource-group thalos-rg \
     --name thalos-web \
     --image <registry>/thalos-web:latest \
     --dns-name-label thalos-web \
     --ports 3000
   ```

### Vercel (Frontend Only)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from web app directory**
   ```bash
   cd apps/web
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard**

### Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

## Environment Configuration

### Production Environment Variables

**Frontend (.env)**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
API_URL=https://api.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Node Environment
NODE_ENV=production
```

**Backend (.env)**
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Application
ENVIRONMENT=production
DEBUG=false
API_HOST=0.0.0.0
API_PORT=8000

# CORS (list allowed origins)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Secrets Management

#### Using Docker Secrets
```bash
echo "my_secure_password" | docker secret create postgres_password -
```

Update `docker-compose.yml`:
```yaml
services:
  postgres:
    secrets:
      - postgres_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password

secrets:
  postgres_password:
    external: true
```

#### Using AWS Secrets Manager
```python
import boto3
import json

def get_secret():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='thalos/prod/db')
    return json.loads(response['SecretString'])
```

## Database Setup

### Initial Migration

**Frontend (Prisma)**
```bash
cd apps/web
npx prisma migrate deploy
```

**Backend (Alembic)**
```bash
cd apps/api
alembic upgrade head
```

### Backup Strategy

1. **Automated backups**
   ```bash
   # Create backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   docker exec thalos-postgres pg_dump -U postgres thalos_prime > backups/backup_$DATE.sql
   ```

2. **Schedule with cron**
   ```bash
   0 2 * * * /path/to/backup_script.sh
   ```

3. **Backup to S3**
   ```bash
   aws s3 cp backups/backup_$DATE.sql s3://your-bucket/backups/
   ```

### Restore from Backup

```bash
docker exec -i thalos-postgres psql -U postgres thalos_prime < backups/backup_20240101.sql
```

## Monitoring

### Health Checks

**API Health Endpoint**
```bash
curl http://localhost:8000/api/health
```

**Frontend Health Check**
```bash
curl -I http://localhost:3000
```

### Logging

#### Centralized Logging

1. **Using ELK Stack**
   ```yaml
   # docker-compose.yml
   elasticsearch:
     image: elasticsearch:8.11.0
   
   logstash:
     image: logstash:8.11.0
   
   kibana:
     image: kibana:8.11.0
   ```

2. **Application Logging**
   ```python
   # Backend
   import logging
   logging.basicConfig(level=logging.INFO)
   logger = logging.getLogger(__name__)
   ```

### Monitoring Tools

#### Prometheus + Grafana

1. **Add metrics endpoint**
   ```python
   # Backend
   from prometheus_fastapi_instrumentator import Instrumentator
   
   Instrumentator().instrument(app).expose(app)
   ```

2. **Configure Prometheus**
   ```yaml
   scrape_configs:
     - job_name: 'thalos-api'
       static_configs:
         - targets: ['api:8000']
   ```

#### Application Performance Monitoring

- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Full-stack observability
- **Datadog**: Infrastructure and application monitoring

### Security Considerations

1. **Use HTTPS in production**
   - Configure SSL/TLS certificates
   - Use Let's Encrypt for free certificates

2. **Set security headers**
   ```python
   # FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   from fastapi.middleware.trustedhost import TrustedHostMiddleware
   
   app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*.yourdomain.com"])
   ```

3. **Database security**
   - Use strong passwords
   - Limit network access
   - Enable SSL connections
   - Regular security updates

4. **Container security**
   - Run as non-root user
   - Scan images for vulnerabilities
   - Keep base images updated

### Performance Optimization

1. **Database Connection Pooling**
   ```python
   # SQLAlchemy
   engine = create_engine(
       DATABASE_URL,
       pool_size=10,
       max_overflow=20,
       pool_pre_ping=True
   )
   ```

2. **Caching**
   - Redis for session storage
   - CDN for static assets
   - Browser caching headers

3. **Load Balancing**
   - Nginx reverse proxy
   - Cloud load balancers (ALB, GCL, Azure LB)

### Rollback Strategy

1. **Tag deployments**
   ```bash
   docker tag thalos-web:latest thalos-web:v1.0.0
   ```

2. **Quick rollback**
   ```bash
   docker-compose down
   docker-compose up -d thalos-web:v0.9.0
   ```

3. **Database rollback**
   ```bash
   alembic downgrade -1
   ```

## Troubleshooting

### Common Issues

**Port conflicts**
```bash
lsof -ti:3000 | xargs kill -9
```

**Database connection issues**
- Check DATABASE_URL
- Verify network connectivity
- Check PostgreSQL logs

**Container logs**
```bash
docker-compose logs -f [service-name]
```

### Support

For deployment issues:
1. Check logs first
2. Review environment variables
3. Verify network connectivity
4. Check resource limits
5. Consult documentation

---

**Important**: Always test deployments in a staging environment before production!
