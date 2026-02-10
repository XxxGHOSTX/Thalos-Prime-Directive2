"""
################################################################################
# THALOS PRIME | COMPLIANCE SCANNER (THALOS GUARD)                            #
# [SYSTEMIC IMMUNE SYSTEM]                                                    #
################################################################################
"""

import os
import re
import logging
import time

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [THALOS-GUARD] - %(message)s"
)
logger = logging.getLogger(__name__)

# Compliance penalty per violation (subtracted from base score of 100)
COMPLIANCE_PENALTY = 10


class ThalosGuard:
    """Enforces architectural purity and naming conventions."""

    def __init__(self, root_dir="."):
        self.root_dir = root_dir
        self.snake_case_pattern = re.compile(r"^[a-z0-9_]+$")
        self.pascal_case_pattern = re.compile(r"^[A-Z][a-zA-Z0-9]+$")

    def scan_directory(self):
        """Recursively scans for Python files and validates compliance."""
        logger.info("Initiating deep-scan of local sector...")
        compliance_score = 100

        for root, dirs, files in os.walk(self.root_dir):
            # Skip hidden directories and __pycache__
            dirs[:] = [d for d in dirs if not d.startswith(".") and d != "__pycache__"]

            for filename in files:
                if filename.endswith(".py"):
                    filepath = os.path.join(root, filename)
                    if not self._validate_file(filepath, filename):
                        compliance_score -= COMPLIANCE_PENALTY

        logger.info(f"Scan complete. Ecosystem Compliance Score: {compliance_score}%")

    def _validate_file(self, filepath: str, filename: str) -> bool:
        """Checks for 'snake_case' filenames and Inscriptional Headers."""
        # Check 1: Filename Convention
        name_root = filename[:-3]
        if (
            not self.snake_case_pattern.match(name_root) and not name_root.isupper()
        ):  # Allow UPPERCASE constants
            # Special exception for the main APP file which is UPPERCASE
            if filename != "THALOS_PRIME_APP.py":
                logger.warning(
                    f"Compliance Violation: {filename} does not adhere to snake_case."
                )
                return False

        # Check 2: Inscriptional Header presence
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read(500)  # Read first 500 chars
                if "THALOS PRIME" not in content or "################" not in content:
                    logger.warning(
                        f"Integrity Violation: {filename} missing Inscriptional Header."
                    )
                    return False
        except Exception:
            return False

        return True


if __name__ == "__main__":
    guard = ThalosGuard()
    # Continuous immune surveillance
    while True:
        guard.scan_directory()
        time.sleep(30)
