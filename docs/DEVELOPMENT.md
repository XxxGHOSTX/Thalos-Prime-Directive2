# Development Guide

## Getting Started

This guide will help you set up your development environment and understand the development workflow.

## Prerequisites

Ensure you have the following installed:

- Node.js 18+ and npm 9+
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 16+ (optional, if not using Docker)
- Git

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/XxxGHOSTX/Thalos-Prime-Directive2.git
cd Thalos-Prime-Directive2

# Install Node.js dependencies
npm install

# Set up Python virtual environment
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 2. Environment Configuration

```bash
# Copy environment templates
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# Edit the files with your local configuration
```

### 3. Database Setup

#### Using Docker (Recommended)

```bash
# Start only the database
docker-compose up -d postgres

# Wait for database to be ready
docker-compose logs -f postgres
```

#### Manual PostgreSQL Setup

```bash
# Create database
createdb thalos_prime

# Update DATABASE_URL in .env files
```

### 4. Run Migrations

**Frontend (Prisma):**
```bash
cd apps/web
npx prisma generate
npx prisma migrate dev --name init
```

**Backend (Alembic):**
```bash
cd apps/api
alembic upgrade head
```

## Development Workflow

### Running the Applications

#### Option 1: Docker Compose (Full Stack)

```bash
# Start all services
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: Local Development

**Terminal 1 - Backend:**
```bash
cd apps/api
source venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing project structure
   - Keep DDD principles in mind
   - Write clean, documented code

3. **Test your changes**
   ```bash
   # Lint and type check
   npm run lint --workspace=apps/web
   npm run type-check --workspace=apps/web
   
   # Backend checks
   cd apps/api
   black . --check
   flake8 .
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Project Structure Guide

### Frontend (Next.js)

```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── domain/                 # Domain layer
│   ├── entities/          # Business entities
│   └── repositories/      # Repository interfaces
│
├── application/            # Application layer
│   └── use-cases/         # Use case implementations
│
├── infrastructure/         # Infrastructure layer
│   └── api/               # API clients
│
└── presentation/           # Presentation layer
    └── components/        # React components
```

### Backend (FastAPI)

```
apps/api/src/
├── domain/                 # Domain layer
│   ├── entities/          # Business entities
│   └── repositories/      # Repository interfaces
│
├── application/            # Application layer
│   └── use_cases/         # Use case implementations
│
├── infrastructure/         # Infrastructure layer
│   └── database/          # Database models and config
│
└── presentation/           # Presentation layer
    └── routes/            # API endpoints
```

## Adding New Features

### Adding a New Entity

1. **Define domain entity** in both frontend and backend
   - `apps/web/src/domain/entities/YourEntity.ts`
   - `apps/api/src/domain/entities/your_entity.py`

2. **Create repository interface**
   - `apps/web/src/domain/repositories/YourEntityRepository.ts`
   - `apps/api/src/domain/repositories/your_entity_repository.py`

3. **Add database model**
   - Update Prisma schema: `apps/web/prisma/schema.prisma`
   - Add SQLAlchemy model: `apps/api/src/infrastructure/database/models.py`

4. **Create migrations**
   ```bash
   # Frontend
   cd apps/web
   npx prisma migrate dev --name add_your_entity
   
   # Backend
   cd apps/api
   alembic revision --autogenerate -m "Add your entity"
   alembic upgrade head
   ```

5. **Implement use cases**
   - Application layer logic in both apps

6. **Create API routes** (backend)
   - `apps/api/src/presentation/routes/your_entity.py`

7. **Update API client** (frontend)
   - Add methods to fetch/mutate data

8. **Create UI components** (frontend)
   - `apps/web/src/presentation/components/your-entity/`

### Adding API Contracts

1. **Define in shared package**
   ```typescript
   // packages/api-contracts/src/types/your-entity-contracts.ts
   export const YourEntitySchema = z.object({
     // fields
   })
   ```

2. **Use in backend validation**
   ```python
   from pydantic import BaseModel
   
   class YourEntityRequest(BaseModel):
       # Match TypeScript schema
   ```

3. **Use in frontend**
   ```typescript
   import { YourEntitySchema } from '@thalos/api-contracts'
   
   const validated = YourEntitySchema.parse(data)
   ```

## Database Operations

### Creating Migrations

**Prisma:**
```bash
cd apps/web
npx prisma migrate dev --name your_migration_name
```

**Alembic:**
```bash
cd apps/api
alembic revision --autogenerate -m "Your migration name"
alembic upgrade head
```

### Reverting Migrations

**Prisma:**
```bash
npx prisma migrate reset  # Resets database
```

**Alembic:**
```bash
alembic downgrade -1  # Go back one migration
```

### Seeding Data

Create seed scripts in:
- `apps/web/prisma/seed.ts` (Prisma)
- `apps/api/scripts/seed.py` (Python)

## Debugging

### Frontend Debugging

1. **Use React DevTools**
2. **Console logging**
   ```typescript
   console.log('Debug:', data)
   ```
3. **VS Code debugger** with Next.js configuration

### Backend Debugging

1. **Use FastAPI interactive docs**
   - Visit http://localhost:8000/docs

2. **Python debugger**
   ```python
   import pdb; pdb.set_trace()
   ```

3. **Logging**
   ```python
   import logging
   logger = logging.getLogger(__name__)
   logger.info('Debug message')
   ```

## Code Style

### TypeScript/JavaScript

- Use TypeScript strict mode
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Python

- Follow PEP 8
- Use type hints
- Use Black for formatting
- Add docstrings to functions

## Testing

### Running Tests

```bash
# Frontend tests (when implemented)
npm test --workspace=apps/web

# Backend tests (when implemented)
cd apps/api
pytest
```

### Writing Tests

**Frontend:**
```typescript
describe('TaskEntity', () => {
  it('should create a task', () => {
    const task = Task.create({ title: 'Test' })
    expect(task.status).toBe(TaskStatus.PENDING)
  })
})
```

**Backend:**
```python
def test_create_task():
    task = Task.create(title="Test")
    assert task.status == TaskStatus.PENDING
```

## Performance Optimization

### Frontend

- Use `useMemo` and `useCallback` appropriately
- Implement code splitting
- Optimize images with Next.js Image component
- Use dynamic imports for heavy components

### Backend

- Use async/await for I/O operations
- Implement database connection pooling
- Add database indexes for frequent queries
- Use select queries instead of loading full objects

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8000 | xargs kill -9  # Backend
```

**Database connection issues:**
```bash
# Check PostgreSQL is running
docker-compose ps
# Check connection string in .env
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Python
pip install -r requirements.txt --force-reinstall
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)

## Getting Help

- Check the documentation in `/docs`
- Review existing code for patterns
- Ask questions in pull requests
- Consult architecture documentation

Happy coding! 🚀
