# THALOS PRIME Quick Start Guide

## Prerequisites
- Python 3.11 or higher
- pip package manager

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/XxxGHOSTX/Thalos-Prime-Directive2.git
   cd Thalos-Prime-Directive2
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database:**
   ```bash
   python thalos_database_schema.py
   ```

## Running the System

### Option 1: Full Ecosystem (Recommended)

Run all components using the orchestrator:

```bash
python deploy_server.py
```

This will start:
- Regulatory Gateway (Port 5000)
- Cognitive Engine
- Hyper Nextus Server (Port 5001)
- Perpetual Optimizer
- Thalos Guard

Press `Ctrl+C` to gracefully shutdown all components.

### Option 2: Individual Components

Run components separately in different terminals:

**Terminal 1 - Regulatory Gateway:**
```bash
python THALOS_PRIME_APP.py
```

**Terminal 2 - Cognitive Engine:**
```bash
python thalos_sbi_core_v6.py
```

**Terminal 3 - Hyper Nextus Server:**
```bash
python hyper_nextus_server.py
```

**Terminal 4 - Perpetual Optimizer:**
```bash
python perpetual_optimizer.py
```

**Terminal 5 - Compliance Scanner:**
```bash
python compliance_scanner.py
```

## Accessing the Interface

1. **Start the Regulatory Gateway** (either through deploy_server.py or directly)

2. **Open the HTML interface:**
   - Open `thalos_prime.html` in your web browser
   - The interface will connect to `http://localhost:5000`
   - You should see real-time CPU and memory metrics

3. **Expected output:**
   - Status indicator should show "SYNCHRONIZED" in cyan
   - CPU percentage updates every second
   - Memory saturation displayed as percentage
   - Latency measurements shown

## Testing the API

### Send telemetry data to the gateway:

```bash
curl -X POST http://localhost:5000/api/v1/sensory \
  -H "Content-Type: application/json" \
  -H "X-Thalos-Inscription: test_inscription_header_32chars_minimum" \
  -d '{
    "thermal_index": 45.5,
    "memory_saturation": 0.65,
    "neural_activation": [0.1, 0.2, 0.3, 0.4, 0.5],
    "metadata": {"source": "test"}
  }'
```

Expected response:
```json
{
  "status": "success",
  "ts": 1234567890.123,
  "audit_id": "abc123def456"
}
```

## Docker Deployment

### Build the image:
```bash
docker build -t thalos-prime .
```

### Run the container:
```bash
docker run -p 5000:5000 -p 5001:5001 \
  -e THALOS_SECRET=your_secret_key_here \
  thalos-prime
```

### With docker-compose (optional):

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  thalos-prime:
    build: .
    ports:
      - "5000:5000"
      - "5001:5001"
    environment:
      - THALOS_SECRET=your_secret_key_here
    volumes:
      - ./data:/app/data
```

Run:
```bash
docker-compose up
```

## Troubleshooting

### Port already in use
If ports 5000 or 5001 are already in use:
```bash
# Find the process using the port
lsof -i :5000
# Kill the process or change the port in the code
```

### ModuleNotFoundError
Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### Database locked error
Stop all running instances before restarting:
```bash
pkill -f "python.*thalos"
```

### WebSocket connection failed
- Ensure Regulatory Gateway is running on port 5000
- Check browser console for errors
- Verify no CORS issues (SocketIO is configured with cors_allowed_origins="*")

## Monitoring and Logs

All components log to stdout with timestamps:
- `[THALOS-GATEWAY]` - Regulatory Gateway
- `[SBI-CORE]` - Cognitive Engine
- `[HYPER-NEXTUS]` - Hyper Nextus Server
- `[OPTIMIZER]` - Perpetual Optimizer
- `[THALOS-GUARD]` - Compliance Scanner

To save logs:
```bash
python deploy_server.py 2>&1 | tee thalos.log
```

## Development

### Run linting:
```bash
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
```

### Format code:
```bash
black .
```

### Run tests:
```bash
python -m compileall .
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `THALOS_SECRET` | Secret key for the Flask app | `primordial_entropy_key_v1_0_0` |

**Note:** Never use the default secret in production!

## Support

For issues or questions, refer to:
- `README.md` - General overview
- `ARCHITECTURE.md` - System architecture details
- GitHub Issues
