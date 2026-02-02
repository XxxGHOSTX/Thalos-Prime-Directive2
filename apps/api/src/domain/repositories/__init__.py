"""
Initialize domain repositories module
"""

from src.domain.repositories.user_repository import UserRepository
from src.domain.repositories.task_repository import TaskRepository

__all__ = ["UserRepository", "TaskRepository"]
