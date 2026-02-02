"""
FastAPI Main Application
Production-ready API with DDD patterns
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.presentation.routes import tasks, users, health

app = FastAPI(
    title="Thalos Prime API",
    description="Production-ready API with Domain-Driven Design",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])


@app.get("/")
async def root():
    return {
        "name": "Thalos Prime API",
        "version": "1.0.0",
        "status": "operational",
    }
