"""
################################################################################
# THALOS PRIME | GENOMIC DATABASE SCHEMA                                      #
# [PERSISTENCE STRATUM]                                                       #
################################################################################
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

Base = declarative_base()


class GenomicAudit(Base):
    """Immutable ledger of all state-mutating operations."""

    __tablename__ = "genomic_audit"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    function_signature = Column(String(255), nullable=False)
    integrity_hash = Column(String(64), nullable=False)  # SHA-256
    state_delta = Column(JSON, nullable=False)
    origin_ip = Column(String(45))


class HeuristicWeightRegistry(Base):
    """Tracking table for the evolutionary shifts in SBI weights."""

    __tablename__ = "heuristic_weights"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    dimension_vector = Column(JSON, nullable=False)
    convergence_score = Column(Float)


def initialize_dna(connection_string: str = "sqlite:///thalos_prime_evolution.db"):
    """Synthesizes the database structure if it does not exist."""
    engine = create_engine(connection_string)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)


if __name__ == "__main__":
    print("[SYSTEM] Synthesizing Genomic DNA Storage...")
    Session = initialize_dna()
    print("[SYSTEM] Persistence Stratum Online.")
