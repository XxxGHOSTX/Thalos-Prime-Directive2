"""
Domain Entity: User
Represents a user in the system following DDD principles
"""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class UserId:
    value: UUID


@dataclass
class User:
    """User domain entity"""

    id: UserId
    email: str
    name: str
    created_at: datetime
    updated_at: datetime

    @classmethod
    def create(cls, email: str, name: str) -> "User":
        """Factory method to create a new user"""
        now = datetime.utcnow()
        return cls(
            id=UserId(uuid4()),
            email=email,
            name=name,
            created_at=now,
            updated_at=now,
        )

    def update_name(self, name: str) -> None:
        """Update user name"""
        self.name = name
        self.updated_at = datetime.utcnow()
