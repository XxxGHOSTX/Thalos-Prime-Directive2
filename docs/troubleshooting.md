# Troubleshooting Guide

## Common Issues and Solutions

### Application Won't Start

#### Issue: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::8080
```

**Solutions:**
1. Check what's using the port:
   ```bash
   lsof -i :8080
   # or
   netstat -tuln | grep 8080
   ```

2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

3. Use a different port:
   ```bash
   export APP_PORT=8081
   ```

#### Issue: Missing Environment Variables

**Symptoms:**
```
Error: Required environment variable APP_PORT is not set
```

**Solutions:**
1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Set variables manually:
   ```bash
   export APP_PORT=8080
   export APP_ENV=development
   ```

3. Check .env file is loaded:
   ```bash
   cat .env
   ```

#### Issue: Module Not Found

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solutions:**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Clear cache and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Docker Issues

#### Issue: Docker Build Fails

**Symptoms:**
```
ERROR [builder 3/3] RUN npm ci --only=production
```

**Solutions:**
1. Check Docker is running:
   ```bash
   docker ps
   ```

2. Clear Docker cache:
   ```bash
   docker builder prune -a
   ```

3. Build with no cache:
   ```bash
   docker build --no-cache -t thalos-prime .
   ```

#### Issue: Container Exits Immediately

**Symptoms:**
Container starts then stops immediately.

**Solutions:**
1. Check container logs:
   ```bash
   docker logs <container-id>
   ```

2. Run interactively:
   ```bash
   docker run -it thalos-prime sh
   ```

3. Check environment variables:
   ```bash
   docker inspect <container-id> | grep -A 20 Env
   ```

#### Issue: Cannot Connect to Container

**Symptoms:**
```
curl: (7) Failed to connect to localhost port 8080
```

**Solutions:**
1. Check container is running:
   ```bash
   docker ps
   ```

2. Check port mapping:
   ```bash
   docker port <container-name>
   ```

3. Verify health check:
   ```bash
   docker inspect <container-name> | grep -A 10 Health
   ```

### Kubernetes Issues

#### Issue: ImagePullBackOff

**Symptoms:**
```
Failed to pull image: rpc error: code = Unknown desc = Error response from daemon
```

**Solutions:**
1. Check image exists:
   ```bash
   docker images | grep thalos-prime
   ```

2. Verify image registry:
   ```bash
   kubectl describe pod <pod-name> -n thalos-prime
   ```

3. Check image pull secrets:
   ```bash
   kubectl get secrets -n thalos-prime
   ```

4. Update deployment with correct image:
   ```bash
   kubectl set image deployment/thalos-prime thalos-prime=your-registry/thalos-prime:2.0.0 -n thalos-prime
   ```

#### Issue: CrashLoopBackOff

**Symptoms:**
Pod keeps restarting in a loop.

**Solutions:**
1. Check pod logs:
   ```bash
   kubectl logs <pod-name> -n thalos-prime
   kubectl logs <pod-name> -n thalos-prime --previous
   ```

2. Check events:
   ```bash
   kubectl describe pod <pod-name> -n thalos-prime
   ```

3. Check resource limits:
   ```bash
   kubectl top pod <pod-name> -n thalos-prime
   ```

4. Increase resources if needed:
   ```yaml
   resources:
     limits:
       memory: "1Gi"
       cpu: "1000m"
   ```

#### Issue: Pod Not Ready

**Symptoms:**
```
0/1 Ready
```

**Solutions:**
1. Check readiness probe:
   ```bash
   kubectl describe pod <pod-name> -n thalos-prime
   ```

2. Test health endpoint directly:
   ```bash
   kubectl port-forward <pod-name> 8080:8080 -n thalos-prime
   curl http://localhost:8080/health/ready
   ```

3. Check application logs:
   ```bash
   kubectl logs <pod-name> -n thalos-prime
   ```

#### Issue: Service Not Accessible

**Symptoms:**
Cannot access service from outside cluster.

**Solutions:**
1. Check service:
   ```bash
   kubectl get svc -n thalos-prime
   ```

2. Check endpoints:
   ```bash
   kubectl get endpoints thalos-prime -n thalos-prime
   ```

3. Test from inside cluster:
   ```bash
   kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- curl http://thalos-prime.thalos-prime.svc.cluster.local/health
   ```

4. Check ingress:
   ```bash
   kubectl describe ingress -n thalos-prime
   ```

### Performance Issues

#### Issue: High Memory Usage

**Symptoms:**
Memory usage keeps increasing.

**Solutions:**
1. Check memory usage:
   ```bash
   # Docker
   docker stats
   
   # Kubernetes
   kubectl top pods -n thalos-prime
   ```

2. Enable memory profiling:
   ```bash
   export LOG_LEVEL=debug
   ```

3. Restart application:
   ```bash
   kubectl rollout restart deployment/thalos-prime -n thalos-prime
   ```

4. Increase memory limits if legitimate:
   ```yaml
   resources:
     limits:
       memory: "1Gi"
   ```

#### Issue: Slow Response Times

**Symptoms:**
API responses take too long.

**Solutions:**
1. Check logs for slow operations:
   ```bash
   kubectl logs -f <pod-name> -n thalos-prime | grep duration
   ```

2. Check CPU usage:
   ```bash
   kubectl top pods -n thalos-prime
   ```

3. Scale up replicas:
   ```bash
   kubectl scale deployment/thalos-prime --replicas=5 -n thalos-prime
   ```

4. Optimize application code

#### Issue: Rate Limiting Too Aggressive

**Symptoms:**
```
429 Too Many Requests
```

**Solutions:**
1. Adjust rate limit configuration:
   ```bash
   export RATE_LIMIT_MAX_REQUESTS=200
   export RATE_LIMIT_WINDOW=900000
   ```

2. Update ConfigMap:
   ```yaml
   RATE_LIMIT_MAX_REQUESTS: "200"
   ```

3. Restart pods to apply changes:
   ```bash
   kubectl rollout restart deployment/thalos-prime -n thalos-prime
   ```

### Monitoring Issues

#### Issue: Metrics Not Available

**Symptoms:**
```
curl http://localhost:9090/metrics
404 Not Found
```

**Solutions:**
1. Check metrics are enabled:
   ```bash
   echo $ENABLE_METRICS
   ```

2. Enable metrics:
   ```bash
   export ENABLE_METRICS=true
   ```

3. Restart application

4. Verify metrics endpoint:
   ```bash
   curl http://localhost:8080/metrics
   ```

#### Issue: Logs Not Appearing

**Symptoms:**
No logs visible in kubectl logs or docker logs.

**Solutions:**
1. Check log level:
   ```bash
   echo $LOG_LEVEL
   ```

2. Set to debug:
   ```bash
   export LOG_LEVEL=debug
   ```

3. Check stdout/stderr:
   ```bash
   kubectl logs <pod-name> -n thalos-prime --all-containers=true
   ```

### Security Issues

#### Issue: CORS Errors

**Symptoms:**
```
Access to fetch at 'http://localhost:8080/api/status' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. Enable CORS:
   ```bash
   export ENABLE_CORS=true
   ```

2. Set allowed origins:
   ```bash
   export ALLOWED_ORIGINS=http://localhost:3000,https://app.example.com
   ```

3. For development, allow all:
   ```bash
   export ALLOWED_ORIGINS=*
   ```

#### Issue: Certificate Errors

**Symptoms:**
```
x509: certificate signed by unknown authority
```

**Solutions:**
1. Check TLS certificate:
   ```bash
   kubectl get secret thalos-prime-tls -n thalos-prime
   ```

2. Verify certificate issuer:
   ```bash
   kubectl describe certificate -n thalos-prime
   ```

3. Install cert-manager if using Let's Encrypt

### Network Issues

#### Issue: DNS Resolution Failed

**Symptoms:**
```
getaddrinfo ENOTFOUND
```

**Solutions:**
1. Check DNS configuration:
   ```bash
   kubectl exec -it <pod-name> -n thalos-prime -- nslookup google.com
   ```

2. Check CoreDNS:
   ```bash
   kubectl get pods -n kube-system -l k8s-app=kube-dns
   ```

3. Restart CoreDNS:
   ```bash
   kubectl rollout restart deployment/coredns -n kube-system
   ```

#### Issue: Connection Timeout

**Symptoms:**
Requests time out connecting to external services.

**Solutions:**
1. Check network policies:
   ```bash
   kubectl get networkpolicies -n thalos-prime
   ```

2. Test connectivity:
   ```bash
   kubectl exec -it <pod-name> -n thalos-prime -- curl -v https://api.example.com
   ```

3. Check firewall rules

4. Verify service endpoints

## Debug Mode

Enable debug mode for more detailed logging:

```bash
export LOG_LEVEL=debug
export ENABLE_DEBUG_MODE=true
```

## Getting Help

### Check Application Version

```bash
curl http://localhost:8080/ | jq .version
```

### Collect Diagnostic Information

```bash
# For Docker
docker logs <container-id> > logs.txt
docker inspect <container-id> > inspect.txt

# For Kubernetes
kubectl describe pod <pod-name> -n thalos-prime > describe.txt
kubectl logs <pod-name> -n thalos-prime > logs.txt
kubectl get events -n thalos-prime > events.txt
```

### Report Issues

When reporting issues, include:
1. Application version
2. Environment (Docker/Kubernetes)
3. Relevant logs
4. Steps to reproduce
5. Expected vs actual behavior

Create an issue at: https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/issues

## Health Check Debugging

### Test Health Endpoints

```bash
# Basic health
curl -v http://localhost:8080/health

# Readiness
curl -v http://localhost:8080/health/ready

# Liveness
curl -v http://localhost:8080/health/live
```

### Inside Kubernetes Pod

```bash
kubectl exec -it <pod-name> -n thalos-prime -- sh
wget -O- http://localhost:8080/health
```

## Useful Commands

### Docker

```bash
# View container logs
docker logs -f <container-id>

# Execute command in container
docker exec -it <container-id> sh

# Inspect container
docker inspect <container-id>

# View container stats
docker stats <container-id>

# Remove stopped containers
docker container prune
```

### Kubernetes

```bash
# View pod logs
kubectl logs -f <pod-name> -n thalos-prime

# Execute command in pod
kubectl exec -it <pod-name> -n thalos-prime -- sh

# Port forward
kubectl port-forward <pod-name> 8080:8080 -n thalos-prime

# Describe resources
kubectl describe pod <pod-name> -n thalos-prime

# View events
kubectl get events -n thalos-prime --sort-by='.lastTimestamp'

# Resource usage
kubectl top pods -n thalos-prime
kubectl top nodes
```

## Prevention Tips

1. ✅ Always test changes in staging first
2. ✅ Monitor resource usage regularly
3. ✅ Keep dependencies up to date
4. ✅ Use proper logging levels
5. ✅ Implement proper error handling
6. ✅ Set up alerts for critical issues
7. ✅ Document configuration changes
8. ✅ Regular backups
9. ✅ Load testing before production
10. ✅ Have rollback plan ready
