"""
Task Routes
RESTful API endpoints for task management
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

router = APIRouter()


class TaskCreateRequest(BaseModel):
    """Request model for creating a task"""
    title: str
    description: str
    assignee_id: Optional[str] = None


class TaskUpdateRequest(BaseModel):
    """Request model for updating a task"""
    status: Optional[str] = None
    assignee_id: Optional[str] = None


class TaskResponse(BaseModel):
    """Response model for task data"""
    id: str
    title: str
    description: str
    status: str
    assignee_id: Optional[str]
    created_at: str
    updated_at: str


@router.get("/", response_model=List[TaskResponse])
async def get_tasks():
    """Get all tasks"""
    # Mock data for now
    return [
        {
            "id": "660e8400-e29b-41d4-a716-446655440000",
            "title": "Initialize Project",
            "description": "Set up the monorepo structure",
            "status": "COMPLETED",
            "assignee_id": None,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z",
        },
        {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "title": "Implement DDD Patterns",
            "description": "Create domain entities and repositories",
            "status": "IN_PROGRESS",
            "assignee_id": None,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z",
        }
    ]


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreateRequest):
    """Create a new task"""
    # Mock response for now
    return {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "title": task_data.title,
        "description": task_data.description,
        "status": "PENDING",
        "assignee_id": task_data.assignee_id,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
    }


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: UUID):
    """Get task by ID"""
    # Mock response for now
    return {
        "id": str(task_id),
        "title": "Sample Task",
        "description": "This is a sample task",
        "status": "PENDING",
        "assignee_id": None,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
    }


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: UUID, task_data: TaskUpdateRequest):
    """Update task"""
    # Mock response for now
    return {
        "id": str(task_id),
        "title": "Sample Task",
        "description": "This is a sample task",
        "status": task_data.status or "PENDING",
        "assignee_id": task_data.assignee_id,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
    }
