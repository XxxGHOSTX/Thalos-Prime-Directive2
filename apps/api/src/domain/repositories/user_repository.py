"""
Domain Repository Interface: User Repository
Defines the contract for user data access
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from src.domain.entities.user import User


class UserRepository(ABC):
    """Abstract user repository"""

    @abstractmethod
    async def find_by_id(self, user_id: UUID) -> Optional[User]:
        """Find user by ID"""
        pass

    @abstractmethod
    async def find_by_email(self, email: str) -> Optional[User]:
        """Find user by email"""
        pass

    @abstractmethod
    async def find_all(self) -> List[User]:
        """Find all users"""
        pass

    @abstractmethod
    async def save(self, user: User) -> None:
        """Save user"""
        pass

    @abstractmethod
    async def delete(self, user_id: UUID) -> None:
        """Delete user"""
        pass
