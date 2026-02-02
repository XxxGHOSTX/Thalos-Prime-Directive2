"""
Domain Repository Interface: Task Repository
Defines the contract for task data access
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from src.domain.entities.task import Task, TaskStatus


class TaskRepository(ABC):
    """Abstract task repository"""

    @abstractmethod
    async def find_by_id(self, task_id: UUID) -> Optional[Task]:
        """Find task by ID"""
        pass

    @abstractmethod
    async def find_by_status(self, status: TaskStatus) -> List[Task]:
        """Find tasks by status"""
        pass

    @abstractmethod
    async def find_by_assignee(self, assignee_id: UUID) -> List[Task]:
        """Find tasks by assignee"""
        pass

    @abstractmethod
    async def find_all(self) -> List[Task]:
        """Find all tasks"""
        pass

    @abstractmethod
    async def save(self, task: Task) -> None:
        """Save task"""
        pass

    @abstractmethod
    async def delete(self, task_id: UUID) -> None:
        """Delete task"""
        pass
