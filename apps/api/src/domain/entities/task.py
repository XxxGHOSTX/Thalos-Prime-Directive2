"""
Domain Entity: Task
Represents a task in the system following DDD principles
"""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4


class TaskStatus(str, Enum):
    """Task status enumeration"""

    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


@dataclass
class TaskId:
    value: UUID


@dataclass
class Task:
    """Task domain entity"""

    id: TaskId
    title: str
    description: str
    status: TaskStatus
    assignee_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def create(cls, title: str, description: str, assignee_id: Optional[UUID] = None) -> "Task":
        """Factory method to create a new task"""
        now = datetime.utcnow()
        return cls(
            id=TaskId(uuid4()),
            title=title,
            description=description,
            status=TaskStatus.PENDING,
            assignee_id=assignee_id,
            created_at=now,
            updated_at=now,
        )

    def update_status(self, status: TaskStatus) -> None:
        """Update task status"""
        self.status = status
        self.updated_at = datetime.utcnow()

    def assign_to(self, user_id: UUID) -> None:
        """Assign task to a user"""
        self.assignee_id = user_id
        self.updated_at = datetime.utcnow()
