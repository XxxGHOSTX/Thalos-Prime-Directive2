# Thalos-Prime-Directive2

A Node.js application with comprehensive CI/CD pipeline, linting, testing, and Docker containerization.

## Features

- ✅ Modern Node.js application structure
- ✅ ESLint for code linting
- ✅ Prettier for code formatting
- ✅ Jest for unit testing with coverage
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD pipeline

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Docker (optional, for containerization)

## Installation

```bash
# Install dependencies
npm install
```

## Usage

```bash
# Run the application
npm start

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format
```

## Docker

Build and run the Docker container:

```bash
# Build the Docker image
docker build -t thalos-prime:latest .

# Run the container
docker run thalos-prime:latest
```

## CI/CD

The project includes a comprehensive GitHub Actions workflow that:
- Runs linting checks
- Validates code formatting
- Executes unit tests
- Generates code coverage reports
- Builds Docker image

## Project Structure

```
.
├── src/              # Source code
│   └── index.js      # Main application file
├── tests/            # Test files
│   └── index.test.js # Unit tests
├── .github/          # GitHub configuration
│   └── workflows/    # CI/CD workflows
├── Dockerfile        # Docker configuration
├── package.json      # Project dependencies
├── eslint.config.js  # ESLint configuration
├── .prettierrc       # Prettier configuration
├── jest.config.js    # Jest configuration
└── README.md         # This file
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.