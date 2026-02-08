"""
################################################################################
# THALOS PRIME | COMPLIANCE SCANNER (THALOS GUARD)                            #
# [SYSTEMIC IMMUNE SYSTEM]                                                    #
################################################################################
"""

import os
import re
import logging
import sys
import time

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [THALOS-GUARD] - %(message)s"
)
logger = logging.getLogger(__name__)


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

        for filename in os.listdir(self.root_dir):
            if filename.endswith(".py"):
                if not self._validate_file(filename):
                    compliance_score -= 10

        logger.info(f"Scan complete. Ecosystem Compliance Score: {compliance_score}%")

    def _validate_file(self, filename: str) -> bool:
        """Checks for 'snake_case' filenames and Inscriptional Headers."""
        # Check 1: Filename Convention
        name_root = filename[:-3]
        if (
            not self.snake_case_pattern.match(name_root) and not filename.isupper()
        ):  # Allow UPPERCASE constants
            # Special exception for the main APP file which is UPPERCASE
            if filename != "THALOS_PRIME_APP.py":
                logger.warning(
                    f"Compliance Violation: {filename} does not adhere to snake_case."
                )
                return False

        # Check 2: Inscriptional Header presence
        try:
            with open(filename, "r", encoding="utf-8") as f:
                content = f.read(500)  # Read first 500 chars
                if "THALOS PRIME" not in content and "################" not in content:
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
