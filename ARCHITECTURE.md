# THALOS PRIME System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         THALOS PRIME ECOSYSTEM                       │
│                     Integrated Biocomputing System                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ TIER 1: PERCEPTUAL INTERFACE                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ thalos_prime.html                                            │   │
│  │ • Real-time WebSocket Dashboard                              │   │
│  │ • CPU/Memory Monitoring                                      │   │
│  │ • System Health Visualization                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓ WebSocket                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ TIER 2: CORE PROCESSING STRATUM                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │ THALOS_PRIME_APP.py      │  │ hyper_nextus_server.py   │        │
│  │ Regulatory Gateway       │  │ High-Velocity TCP        │        │
│  │ • Flask/SocketIO (5000)  │  │ • AsyncIO Server (5001)  │        │
│  │ • Request Validation     │  │ • Raw Binary Streams     │        │
│  │ • Telemetry Ingestion    │  │ • Zero-Latency Feedback  │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ thalos_sbi_core_v6.py                                        │   │
│  │ Cognitive Engine                                             │   │
│  │ • Simulation-Based Intelligence                              │   │
│  │ • Genetic Optimizer (Evolutionary Algorithms)                │   │
│  │ • Predictive Intent Engine (Multi-Process)                   │   │
│  │ • Synaptic Bridge (Neural Weight Calibration)                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ TIER 3: AUTONOMOUS SYSTEMS                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │ perpetual_optimizer.py   │  │ compliance_scanner.py    │        │
│  │ Self-Healing Daemon      │  │ Thalos Guard             │        │
│  │ • Complexity Analysis    │  │ • Naming Convention      │        │
│  │ • Shadow Module Loading  │  │ • Header Validation      │        │
│  │ • Memory Monitoring      │  │ • Compliance Scoring     │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ thalos_database_schema.py                                    │   │
│  │ Persistence Stratum                                          │   │
│  │ • SQLAlchemy ORM                                             │   │
│  │ • Genomic Audit Ledger (Immutable State Log)                │   │
│  │ • Heuristic Weight Registry (Evolution Tracking)            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ ORCHESTRATION LAYER                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ deploy_server.py                                             │   │
│  │ Ecosystem Controller                                         │   │
│  │ • Multi-Process Lifecycle Management                         │   │
│  │ • Health Monitoring                                          │   │
│  │ • Graceful Shutdown Coordination                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Browser (thalos_prime.html)
    ↓ WebSocket Connection
Regulatory Gateway (THALOS_PRIME_APP.py) ← HTTP/WS Port 5000
    ↓ Telemetry Data
    ├→ Cognitive Engine (thalos_sbi_core_v6.py)
    │   ↓ Neural Weights
    │   └→ Database (thalos_database_schema.py)
    │
    ├→ Hyper Nextus Server (hyper_nextus_server.py) ← TCP Port 5001
    │
    └→ Monitored By
        ├→ Perpetual Optimizer (perpetual_optimizer.py)
        └→ Compliance Scanner (compliance_scanner.py)
```

## Port Allocation

| Port | Service                  | Protocol        |
|------|--------------------------|-----------------|
| 5000 | Regulatory Gateway       | HTTP/WebSocket  |
| 5001 | Hyper Nextus Server      | TCP (AsyncIO)   |

## Database Schema

**GenomicAudit Table:**
- Immutable audit trail of all state changes
- Indexed by timestamp for temporal queries
- Includes integrity hash (SHA-256)

**HeuristicWeightRegistry Table:**
- Tracks evolution of neural weights
- JSON storage for dimension vectors
- Convergence score tracking

## Key Features

### Security
- Inscriptional header validation (X-Thalos-Inscription)
- No hardcoded secrets in production
- SHA-256 integrity hashing

### Performance
- Multi-process execution (ProcessPoolExecutor)
- Gevent-based async WebSocket handling
- Zero-latency TCP for raw telemetry

### Reliability
- Self-healing daemon monitoring
- Compliance enforcement
- Shadow module loading for stability checks

### Observability
- Real-time system metrics
- Comprehensive logging
- Audit trail persistence
