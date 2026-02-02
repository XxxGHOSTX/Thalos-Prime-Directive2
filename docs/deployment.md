# Deployment Guide

## Prerequisites

Before deploying Thalos Prime Directive 2, ensure you have:

- Docker 20.10+
- Kubernetes cluster 1.20+
- kubectl configured to access your cluster
- Container registry access (Docker Hub, GitHub Container Registry, etc.)

## Local Development Deployment

### Using Docker Compose

1. **Clone the repository**:
   ```bash
   git clone https://github.com/XxxGHOSTX/Thalos-Prime-Directive2.git
   cd Thalos-Prime-Directive2
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**:
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment**:
   ```bash
   curl http://localhost:8080/health
   ```

5. **View logs**:
   ```bash
   docker-compose logs -f app
   ```

6. **Stop the application**:
   ```bash
   docker-compose down
   ```

## Production Deployment

### Step 1: Build the Docker Image

```bash
# Build the image
docker build -t thalos-prime:2.0.0 .

# Tag for your registry
docker tag thalos-prime:2.0.0 your-registry/thalos-prime:2.0.0
docker tag thalos-prime:2.0.0 your-registry/thalos-prime:latest

# Push to registry
docker push your-registry/thalos-prime:2.0.0
docker push your-registry/thalos-prime:latest
```

### Step 2: Prepare Kubernetes Cluster

1. **Create namespace**:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

2. **Configure secrets**:
   ```bash
   # Edit k8s/secret.yaml with your actual secrets
   kubectl apply -f k8s/secret.yaml
   ```

3. **Apply ConfigMap**:
   ```bash
   kubectl apply -f k8s/configmap.yaml
   ```

### Step 3: Deploy Application

1. **Update image reference**:
   Edit `k8s/deployment.yaml` and update the image line:
   ```yaml
   image: your-registry/thalos-prime:2.0.0
   ```

2. **Deploy application**:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   ```

3. **Create service**:
   ```bash
   kubectl apply -f k8s/service.yaml
   ```

4. **Set up autoscaling**:
   ```bash
   kubectl apply -f k8s/hpa.yaml
   ```

5. **Configure ingress** (update domain in k8s/ingress.yaml):
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

### Step 4: Verify Deployment

1. **Check pod status**:
   ```bash
   kubectl get pods -n thalos-prime
   ```

2. **Check service**:
   ```bash
   kubectl get svc -n thalos-prime
   ```

3. **Check logs**:
   ```bash
   kubectl logs -f -n thalos-prime -l app=thalos-prime
   ```

4. **Test health endpoint**:
   ```bash
   kubectl port-forward -n thalos-prime svc/thalos-prime 8080:80
   curl http://localhost:8080/health
   ```

## Deployment to Cloud Providers

### AWS EKS

```bash
# Create EKS cluster
eksctl create cluster --name thalos-prime --region us-west-2

# Configure kubectl
aws eks update-kubeconfig --name thalos-prime --region us-west-2

# Deploy application
kubectl apply -f k8s/
```

### Google GKE

```bash
# Create GKE cluster
gcloud container clusters create thalos-prime \
  --num-nodes=3 \
  --zone=us-central1-a

# Get credentials
gcloud container clusters get-credentials thalos-prime

# Deploy application
kubectl apply -f k8s/
```

### Azure AKS

```bash
# Create AKS cluster
az aks create \
  --resource-group thalos-rg \
  --name thalos-prime \
  --node-count 3

# Get credentials
az aks get-credentials --resource-group thalos-rg --name thalos-prime

# Deploy application
kubectl apply -f k8s/
```

## CI/CD Deployment

### GitHub Actions

The repository includes GitHub Actions workflows for automated deployment:

1. **On Pull Request**: Runs tests and builds
2. **On Main Branch Push**: Deploys to staging
3. **On Tag Push**: Deploys to production

To use:

1. Configure GitHub Secrets:
   - `KUBE_CONFIG`: Base64 encoded kubeconfig
   - Any other secrets needed

2. Push changes:
   ```bash
   git push origin main  # Deploys to staging
   git tag -a v2.0.0 -m "Release v2.0.0"
   git push origin v2.0.0  # Deploys to production
   ```

## Updating Deployment

### Rolling Update

```bash
# Update image version
kubectl set image deployment/thalos-prime \
  thalos-prime=your-registry/thalos-prime:2.0.1 \
  -n thalos-prime

# Watch rollout status
kubectl rollout status deployment/thalos-prime -n thalos-prime
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/thalos-prime -n thalos-prime

# Rollback to specific revision
kubectl rollout undo deployment/thalos-prime --to-revision=2 -n thalos-prime
```

## Scaling

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment/thalos-prime --replicas=5 -n thalos-prime
```

### Auto Scaling

HPA is configured in `k8s/hpa.yaml`:
- Min replicas: 3
- Max replicas: 10
- Target CPU: 70%
- Target Memory: 80%

View HPA status:
```bash
kubectl get hpa -n thalos-prime
```

## Monitoring Deployment

### View Metrics

```bash
# Port forward to metrics endpoint
kubectl port-forward -n thalos-prime svc/thalos-prime 9090:9090
curl http://localhost:9090/metrics
```

### View Logs

```bash
# All pods
kubectl logs -n thalos-prime -l app=thalos-prime --tail=100 -f

# Specific pod
kubectl logs -n thalos-prime <pod-name> -f
```

### Resource Usage

```bash
# Pod resource usage
kubectl top pods -n thalos-prime

# Node resource usage
kubectl top nodes
```

## Troubleshooting Deployment

### Pod Not Starting

```bash
# Describe pod
kubectl describe pod <pod-name> -n thalos-prime

# Check events
kubectl get events -n thalos-prime --sort-by='.lastTimestamp'
```

### ImagePullBackOff

- Verify image name and tag in deployment.yaml
- Check registry credentials
- Ensure image exists in registry

### CrashLoopBackOff

```bash
# Check logs
kubectl logs <pod-name> -n thalos-prime --previous

# Check resource limits
kubectl describe pod <pod-name> -n thalos-prime
```

### Service Not Accessible

```bash
# Check service
kubectl get svc -n thalos-prime

# Check endpoints
kubectl get endpoints -n thalos-prime

# Check ingress
kubectl describe ingress -n thalos-prime
```

## Health Checks

The application provides health check endpoints:

- **Liveness**: `GET /health/live` - Pod is alive
- **Readiness**: `GET /health/ready` - Pod is ready to serve traffic
- **Startup**: First successful readiness check

Configure in `k8s/deployment.yaml`:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Security Considerations

1. **Secrets Management**: Use Kubernetes Secrets or external secret managers
2. **Network Policies**: Implement network policies to restrict traffic
3. **RBAC**: Configure proper role-based access control
4. **Image Scanning**: Scan images for vulnerabilities before deployment
5. **TLS/SSL**: Always use HTTPS in production

## Backup and Disaster Recovery

1. **Configuration Backup**: Store all k8s manifests in version control
2. **State Backup**: If using persistent storage, implement backup strategies
3. **Disaster Recovery**: Document and test recovery procedures

## Performance Tuning

### Application Level
- Adjust worker processes
- Configure connection pooling
- Optimize database queries

### Kubernetes Level
- Right-size resource requests/limits
- Configure HPA thresholds
- Use pod disruption budgets

## Best Practices

1. ✅ Always use specific image tags, not `latest`
2. ✅ Configure resource requests and limits
3. ✅ Use health checks for all deployments
4. ✅ Implement proper logging and monitoring
5. ✅ Use namespaces to separate environments
6. ✅ Apply security best practices
7. ✅ Test deployments in staging before production
8. ✅ Document all configuration changes
9. ✅ Use ConfigMaps for configuration
10. ✅ Keep secrets out of version control
