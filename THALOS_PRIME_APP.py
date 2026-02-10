"""
################################################################################
# THALOS PRIME | REGULATORY GATEWAY (TIER 2)                                  #
# [AUTHORITATIVE CORE IMPLEMENTATION]                                          #
################################################################################
"""

import os
import time
import functools
import logging
import hashlib
import psutil
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from pydantic import BaseModel, ValidationError, Field
from typing import List, Dict, Any, Optional
from threading import Thread

# Provision of high-fidelity logging for the maintenance of audit trails.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [THALOS-GATEWAY] - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# SECRET_KEY configuration: require env var in production
secret_key = os.environ.get("THALOS_SECRET")
if not secret_key:
    env_mode = os.environ.get("FLASK_ENV") or os.environ.get("ENV")
    if env_mode == "development":
        logger.warning(
            "Using default SECRET_KEY in development mode. "
            "Set THALOS_SECRET environment variable for production."
        )
        secret_key = "primordial_entropy_key_v1_0_0"
    else:
        raise ValueError(
            "THALOS_SECRET environment variable must be set in production. "
            "Application will not start without a secure secret key."
        )
app.config["SECRET_KEY"] = secret_key

# CORS configuration: configurable origins with safe defaults
thalos_cors_env = os.environ.get("THALOS_CORS_ALLOWED_ORIGINS")
if thalos_cors_env:
    cors_allowed_origins = [
        origin.strip() for origin in thalos_cors_env.split(",") if origin.strip()
    ]
else:
    # Default behavior: allow all origins only in explicit development mode
    runtime_env = os.environ.get("FLASK_ENV") or os.environ.get("ENV")
    if runtime_env == "development":
        cors_allowed_origins = "*"
        logger.warning(
            "CORS set to allow all origins (*) in development mode. "
            "Set THALOS_CORS_ALLOWED_ORIGINS for production."
        )
    else:
        # In non-development environments, restrict to localhost by default
        cors_allowed_origins = ["http://localhost:5000", "http://127.0.0.1:5000"]
        logger.info(f"CORS restricted to: {cors_allowed_origins}")

# Initialization of the Hyper Nextus Socket Stratum utilizing gevent for maximal concurrency.
socketio = SocketIO(
    app,
    cors_allowed_origins=cors_allowed_origins,
    async_mode="gevent",
    logger=False,
    engineio_logger=False,
)


class SensoryData(BaseModel):
    """Rigorous schema for the validation of high-frequency sensory telemetry."""

    thermal_index: float = Field(..., ge=0, le=100)
    memory_saturation: float = Field(..., ge=0, le=1)
    neural_activation: List[float]
    timestamp: float = Field(default_factory=time.time)
    metadata: Optional[Dict[str, Any]] = None


def validate_inscriptional_header(f):
    """A cryptographic validation layer mandated for the preservation of systemic integrity."""

    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        inscription = request.headers.get("X-Thalos-Inscription")

        # Check if we're in development mode
        env_mode = os.environ.get("FLASK_ENV") or os.environ.get("ENV")
        enforce_auth = os.environ.get("THALOS_ENFORCE_AUTH", "true").lower() == "true"

        # In production or when explicitly enforced, require valid inscription
        if enforce_auth and env_mode != "development":
            if not inscription or len(inscription) < 32:
                logger.warning(
                    f"Integrity Failure: Unsigned access attempt from {request.remote_addr}"
                )
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Inscriptional Integrity Failure",
                        }
                    ),
                    401,
                )
        else:
            # In development, only log warnings
            if not inscription or len(inscription) < 32:
                logger.warning(
                    f"Integrity Warning: Unsigned access attempt from {request.remote_addr} (development mode)"
                )

        return f(*args, **kwargs)

    return decorated_function


def systemic_pulse_generator():
    """Background thread utilized to push biological vitals (CPU/RAM) to the interface."""
    while True:
        cpu = psutil.cpu_percent(interval=1)
        mem = psutil.virtual_memory().percent / 100.0

        payload = {
            "thermal_index": cpu,
            "memory_saturation": mem,
            "neural_activation": [cpu / 100.0, mem],  # Simplified neural proxy
            "timestamp": time.time(),
        }
        socketio.emit("neural_update", payload)
        time.sleep(1)  # Rhythmic pulse


@app.route("/api/v1/sensory", methods=["POST"])
@validate_inscriptional_header
def ingest_telemetry():
    """An ingestion pathway dedicated to sensory gradients and biometric telemetry streams."""
    try:
        json_data = request.get_json(force=False, silent=False)
        if json_data is None:
            logger.error("Request body is empty or not valid JSON")
            return (
                jsonify(
                    {"status": "error", "message": "Request body must be valid JSON"}
                ),
                400,
            )

        data = SensoryData(**json_data)
        logger.info(
            f"Ingested telemetry: Thermal[{data.thermal_index}] Activation_Nodes[{len(data.neural_activation)}]"
        )
        socketio.emit("neural_update", data.model_dump(), broadcast=True)
        return (
            jsonify(
                {
                    "status": "success",
                    "ts": data.timestamp,
                    "audit_id": hashlib.sha256(
                        str(data.timestamp).encode()
                    ).hexdigest()[:12],
                }
            ),
            200,
        )
    except ValidationError as e:
        logger.error(f"Validation failure encountered: {e.json()}")
        return jsonify({"status": "error", "details": e.errors()}), 400
    except Exception as e:
        logger.error(f"Unexpected error processing request: {e}")
        return (
            jsonify({"status": "error", "message": "Internal server error"}),
            500,
        )


@socketio.on("connect")
def handle_neural_link():
    logger.info("Establishment of neural link across Hyper Nextus is confirmed.")
    emit("status", {"state": "synchronized", "message": "Tier 2 Core Online"})


if __name__ == "__main__":
    logger.info(
        "Initialization of the THALOS PRIME Regulatory Gateway on Port 5000 is commencing."
    )
    # Activation of the biological pulse generator
    pulse_thread = Thread(target=systemic_pulse_generator)
    pulse_thread.daemon = True
    pulse_thread.start()

    socketio.run(app, port=5000, host="0.0.0.0")
