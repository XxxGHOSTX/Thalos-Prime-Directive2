"""
################################################################################
# THALOS PRIME | ORCHESTRATOR                                                 #
# [MULTI-SERVER DEPLOYMENT & LIFECYCLE MANAGEMENT]                             #
################################################################################
"""

import subprocess
import time
import sys
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [ORCHESTRATOR] - %(message)s"
)
logger = logging.getLogger(__name__)


class EcosystemController:
    """Facilitates the lifecycle management of multiple biocomputing server instances."""

    def __init__(self):
        self.processes = []
        self.active = True

    def start_module(self, name: str, command: list):
        """Initiates a designated Thalos module as an isolated subprocess."""
        logger.info(f"Initialization of the {name} stratum is commencing...")
        try:
            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
            )
            self.processes.append((name, process))
            return process
        except Exception as e:
            logger.error(f"Initialization failure of {name} encountered: {e}")
            return None

    def monitor(self):
        """Maintains continuous surveillance regarding the health of all initialized strata."""
        logger.info(
            "The THALOS PRIME Ecosystem has achieved ACTIVE status. Telemetry surveillance is in progress."
        )
        try:
            while self.active:
                for name, proc in self.processes:
                    if proc.poll() is not None:
                        logger.error(
                            f"CRITICAL: Unexpected termination of the {name} module detected."
                        )
                        # Self-healing logic implies we should attempt to restart,
                        # but we log for now to preserve the audit trail.
                time.sleep(2)
        except KeyboardInterrupt:
            logger.info("Shutdown signal initiated by the operator.")
            self.shutdown()

    def shutdown(self):
        """Finalizes the graceful termination of all active processes."""
        self.active = False
        logger.info("Commencing the graceful termination sequence...")
        for name, proc in self.processes:
            logger.info(f"Terminating the {name} stratum...")
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
        logger.info("The THALOS PRIME Ecosystem termination sequence is finalized.")
        sys.exit(0)


if __name__ == "__main__":
    controller = EcosystemController()

    # Stratum 1: Regulatory Gateway (Port 5000)
    controller.start_module(
        "Regulatory_Gateway", [sys.executable, "THALOS_PRIME_APP.py"]
    )

    # Stratum 2: SBI Core (Persistent Cognitive Cycle)
    controller.start_module(
        "Cognitive_Engine", [sys.executable, "thalos_sbi_core_v6.py"]
    )

    # Stratum 2.5: Hyper Nextus (Port 5001 - High Velocity)
    controller.start_module("Hyper_Nextus", [sys.executable, "hyper_nextus_server.py"])

    # Stratum 3: Autonomous Core (Optimizer Daemon)
    controller.start_module(
        "Perpetual_Optimizer", [sys.executable, "perpetual_optimizer.py"]
    )

    # Stratum 3.5: Thalos Guard (Compliance Scanner)
    controller.start_module("Thalos_Guard", [sys.executable, "compliance_scanner.py"])

    # Stratum 4: Persistence Layer (Database Initialization)
    subprocess.run([sys.executable, "thalos_database_schema.py"])

    controller.monitor()
