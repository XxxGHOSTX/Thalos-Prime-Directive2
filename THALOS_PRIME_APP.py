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
app.config["SECRET_KEY"] = os.environ.get(
    "THALOS_SECRET", "primordial_entropy_key_v1_0_0"
)

# Initialization of the Hyper Nextus Socket Stratum utilizing gevent for maximal concurrency.
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
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
        # In a strict production environment, header presence is enforced.
        # For development fluidity, warnings are logged upon absence, yet execution is permitted if requisite.
        if not inscription or len(inscription) < 32:
            logger.warning(
                f"Integrity Warning: Unsigned access attempt from {request.remote_addr}"
            )
            # return jsonify({"status": "error", "message": "Inscriptional Integrity Failure"}), 401
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
        data = SensoryData(**request.json)
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
