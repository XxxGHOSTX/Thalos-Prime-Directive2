# Thalos Prime

A production-ready monorepo showcasing modern software architecture with Domain-Driven Design (DDD), TypeScript, and Python.

## 🎯 Vision

Thalos Prime demonstrates enterprise-grade software engineering practices in a full-stack application. Built with a monorepo architecture, it separates concerns through DDD principles while maintaining code reusability and type safety across the entire stack.

## 🏗️ Architecture

### Monorepo Structure

```
thalos-prime/
├── apps/
│   ├── web/              # Next.js 14 App Router frontend
│   │   ├── src/
│   │   │   ├── app/            # Next.js app directory
│   │   │   ├── domain/         # Domain entities & repositories
│   │   │   ├── application/    # Use cases & business logic
│   │   │   ├── infrastructure/ # External services (API client)
│   │   │   └── presentation/   # UI components
│   │   ├── prisma/       # Database schema
│   │   └── Dockerfile
│   │
│   └── api/              # FastAPI backend
│       ├── src/
│       │   ├── domain/         # Domain entities & repositories
│       │   ├── application/    # Use cases & business logic
│       │   ├── infrastructure/ # Database & external services
│       │   └── presentation/   # API routes & controllers
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── domain/           # Shared domain logic
│   └── api-contracts/    # API types & validation
│
├── docs/                 # Documentation
├── docker-compose.yml    # Docker orchestration
└── .github/workflows/    # CI/CD pipelines
```

### Technology Stack

**Frontend:**
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prisma** for database access
- **Zod** for runtime validation

**Backend:**
- **FastAPI** for high-performance API
- **SQLAlchemy** for ORM
- **PostgreSQL** for data persistence
- **Pydantic** for data validation
- **Alembic** for migrations

**Infrastructure:**
- **Docker** & **Docker Compose** for containerization
- **GitHub Actions** for CI/CD
- **PostgreSQL** database

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.11+
- **Docker** and Docker Compose (for containerized development)
- **PostgreSQL** 16+ (if running locally without Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/XxxGHOSTX/Thalos-Prime-Directive2.git
   cd Thalos-Prime-Directive2
   ```

2. **Set up environment variables**
   ```bash
   # Root configuration
   cp .env.example .env
   
   # Frontend configuration
   cp apps/web/.env.example apps/web/.env
   
   # Backend configuration
   cp apps/api/.env.example apps/api/.env
   ```

3. **Update environment variables**
   - Edit `.env` files with your configuration
   - Replace placeholder passwords with secure values
   - Configure database URLs and API endpoints

### Running with Docker (Recommended)

The easiest way to run the entire stack:

```bash
# Build and start all services
npm run docker:build
npm run docker:up

# Or use docker-compose directly
docker-compose up -d
```

Services will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **PostgreSQL:** localhost:5432

To stop services:
```bash
npm run docker:down
```

### Running Locally (Development)

#### Backend Setup

```bash
cd apps/api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (ensure PostgreSQL is running)
alembic upgrade head

# Start the API server
uvicorn main:app --reload
```

Backend will be available at http://localhost:8000

#### Frontend Setup

```bash
# Install all dependencies
npm install

# Generate Prisma client
cd apps/web
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

Frontend will be available at http://localhost:3000

## 📋 Domain-Driven Design

### Core Concepts

This project implements DDD with clear bounded contexts:

1. **Domain Layer**: Business entities and rules (User, Task)
2. **Application Layer**: Use cases orchestrating domain logic
3. **Infrastructure Layer**: External concerns (database, API)
4. **Presentation Layer**: UI components and API routes

### Domain Entities

**User Entity:**
- Unique identifier (UUID)
- Email (unique)
- Name
- Timestamps

**Task Entity:**
- Unique identifier (UUID)
- Title and description
- Status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- Optional assignee (User)
- Timestamps

### Repository Pattern

Repositories abstract data access:
- `UserRepository`: User data operations
- `TaskRepository`: Task data operations

## 🗄️ Database

### Prisma Schema (Frontend)

Located in `apps/web/prisma/schema.prisma`, the schema defines:
- User and Task models
- Relationships
- Indexes and constraints

**Running Migrations:**
```bash
cd apps/web
npx prisma migrate dev --name init
npx prisma generate
```

### SQLAlchemy Models (Backend)

Located in `apps/api/src/infrastructure/database/models.py`

**Running Migrations:**
```bash
cd apps/api
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🧪 Development

### Linting and Type Checking

**Frontend:**
```bash
npm run lint --workspace=apps/web
npm run type-check --workspace=apps/web
```

**Backend:**
```bash
cd apps/api
black .
flake8 .
mypy .
```

### Building for Production

**Frontend:**
```bash
npm run build --workspace=apps/web
```

**Backend:**
```bash
cd apps/api
# Backend is interpreted, no build step required
# Ensure all dependencies are in requirements.txt
```

## 🐳 Docker

### Individual Services

Build individual services:
```bash
# Frontend
docker build -f apps/web/Dockerfile -t thalos-web .

# Backend
docker build -f apps/api/Dockerfile -t thalos-api ./apps/api
```

### Full Stack

Use docker-compose for the complete environment:
```bash
docker-compose up -d --build
```

## 🔄 CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

1. **Lint and Type Check**: ESLint, TypeScript, Black, Flake8
2. **Build Frontend**: Next.js production build
3. **Docker Build Test**: Validates Docker images

## 📦 Shared Packages

### @thalos/domain

Shared domain logic and types used across applications.

### @thalos/api-contracts

API request/response types and Zod validation schemas ensuring type safety between frontend and backend.

## 🔒 Security

- **No hardcoded secrets**: All sensitive data in environment variables
- **Environment files**: `.env.example` templates provided
- **Docker secrets**: Use Docker secrets for production
- **CORS configuration**: Restricted origins in FastAPI
- **Type safety**: TypeScript and Pydantic validation

## 📚 API Documentation

FastAPI provides interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the terms specified in the LICENSE file.

## 🙏 Acknowledgments

Built with modern best practices:
- Domain-Driven Design patterns
- Clean Architecture principles
- Type safety across the stack
- Production-ready infrastructure
- Comprehensive CI/CD

---

**Thalos Prime** - Building the future with robust architecture and engineering excellence.