"""
User Routes
RESTful API endpoints for user management
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List
from uuid import UUID

router = APIRouter()


class UserCreateRequest(BaseModel):
    """Request model for creating a user"""
    email: EmailStr
    name: str


class UserResponse(BaseModel):
    """Response model for user data"""
    id: str
    email: str
    name: str
    created_at: str
    updated_at: str


@router.get("/", response_model=List[UserResponse])
async def get_users():
    """Get all users"""
    # Mock data for now
    return [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "admin@thalos.dev",
            "name": "Admin User",
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z",
        }
    ]


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreateRequest):
    """Create a new user"""
    # Mock response for now
    return {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "email": user_data.email,
        "name": user_data.name,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
    }


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID):
    """Get user by ID"""
    # Mock response for now
    return {
        "id": str(user_id),
        "email": "user@thalos.dev",
        "name": "Test User",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
    }
