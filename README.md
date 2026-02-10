# THALOS PRIME: Integrated Source Code Ledger

## Overview

THALOS PRIME is a sophisticated biocomputing ecosystem comprising multiple interconnected modules designed for high-velocity processing, neural simulation, and autonomous system optimization.

## Architecture

### Tier 1: Perceptual Interface
- **thalos_prime.html**: Real-time WebSocket-based dashboard displaying system vitals

### Tier 2: Core Processing
- **THALOS_PRIME_APP.py**: Regulatory Gateway (Flask/SocketIO server on port 5000)
- **thalos_sbi_core_v6.py**: Simulation-Based Intelligence engine
- **hyper_nextus_server.py**: High-velocity TCP server (port 5001)

### Tier 3: Autonomous Systems
- **perpetual_optimizer.py**: Self-healing daemon monitoring code complexity
- **compliance_scanner.py**: Thalos Guard enforcing coding standards
- **thalos_database_schema.py**: SQLAlchemy persistence layer

### Orchestration
- **deploy_server.py**: Multi-process lifecycle manager

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database
python thalos_database_schema.py
```

## Usage

### Running the Full Ecosystem
```bash
python deploy_server.py
```

### Running Individual Components
```bash
# Regulatory Gateway
python THALOS_PRIME_APP.py

# Cognitive Engine
python thalos_sbi_core_v6.py

# Hyper Nextus Server
python hyper_nextus_server.py

# Perpetual Optimizer
python perpetual_optimizer.py

# Compliance Scanner
python compliance_scanner.py
```

### Accessing the Interface
Open `thalos_prime.html` in a web browser and ensure the Regulatory Gateway is running on port 5000.

## Docker Deployment

```bash
# Build image
docker build -t thalos-prime .

# Run container
docker run -p 5000:5000 -p 5001:5001 thalos-prime
```

## Requirements

- Python 3.11+
- Flask 3.0.0
- Flask-SocketIO 5.3.5
- Pydantic 2.5.3
- NumPy 1.26.2
- SQLAlchemy 2.0.23
- psutil 5.9.8

## License

See LICENSE file for details.