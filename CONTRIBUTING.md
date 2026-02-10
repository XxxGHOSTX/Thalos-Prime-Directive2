# Contributing to Thalos Prime Directive 2

First off, thank you for considering contributing to Thalos Prime Directive 2! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include logs, error messages, or screenshots**
- **Note your environment** (OS, Docker version, Kubernetes version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add or update tests** as needed
4. **Update documentation** to reflect your changes
5. **Ensure the test suite passes**
6. **Make sure your code lints** without errors
7. **Write a good commit message**

#### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the docs/ directory with relevant documentation
3. The PR will be merged once you have approval from maintainers
4. Ensure CI/CD checks pass before requesting review

## Development Setup

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git
- Node.js 18+ (if developing locally)

### Getting Started

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/Thalos-Prime-Directive2.git
   cd Thalos-Prime-Directive2
   ```

2. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Set up the development environment:
   ```bash
   cp .env.example .env
   docker-compose up -d
   ```

4. Make your changes and test:
   ```bash
   docker-compose run --rm app npm test
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request

## Coding Standards

### Style Guide

- Follow existing code style in the project
- Use meaningful variable and function names
- Keep functions small and focused
- Comment complex logic
- Write self-documenting code when possible

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add health check endpoint

Implement /health endpoint for Kubernetes liveness probes.
Includes basic application status and dependency checks.
```

### Testing

- Write tests for new features
- Update tests for bug fixes
- Ensure all tests pass before submitting PR
- Aim for high code coverage (>80%)

### Documentation

- Update README.md for user-facing changes
- Update relevant files in docs/ directory
- Add inline comments for complex logic
- Update API documentation if applicable

## Project Structure

```
.
├── src/                    # Application source code
│   ├── app.js             # Main application
│   ├── routes/            # API routes
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
├── config/                # Configuration files
├── k8s/                   # Kubernetes manifests
├── docs/                  # Documentation
└── .github/               # CI/CD workflows
```

## Review Process

1. Automated checks must pass (tests, linting, security scans)
2. At least one maintainer approval required
3. No unresolved review comments
4. Branch must be up-to-date with main

## Getting Help

- Check the [documentation](docs/)
- Search existing [issues](https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/issues)
- Join discussions in issues or PRs
- Create a new issue if needed

## Recognition

Contributors will be recognized in:
- The project's README
- Release notes
- GitHub contributors page

Thank you for contributing to Thalos Prime Directive 2! 🚀
