# Books API

Example project demonstrating **Clean Architecture** with NestJS and MikroORM.

## Slides

[View presentation](https://docs.google.com/presentation/d/1Hf2pUWK4uaJmgrl4XWM30xRTuxq7r3GYMjdX20GJkQc/edit?slide=id.g3d43dd60a97_0_249#slide=id.g3d43dd60a97_0_249)
[View class](https://www.youtube.com/watch?v=RltjVf7PaPA)

## Architecture

```
src/
├── domain/           # Pure entities (no decorators)
├── application/     # Use cases
├── infrastructure/  # Repositories, MikroORM
└── presentation/    # REST controllers
```

### Key Principles

| Rule | Description |
|------|-------------|
| **Pure Domain** | Entities without framework decorators |
| **Repository per Operation** | One repository per use case, not a fat one |
| **Transactions** | Always use `transactional()` |
| **Direct Imports** | No barrel files |

## Local Setup

### Requirements

- Node.js 18+
- Docker and Docker Compose
- pnpm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd books-api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration if needed
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   # Start the PostgreSQL container
   pnpm docker:up

   # Verify it's running
   pnpm docker:logs
   ```

5. **Build and run the application**
   ```bash
   # Development mode (with hot-reload)
   pnpm start:dev

   # Or build and run in production mode
   pnpm build
   pnpm start:prod
   ```

6. **Verify it works**
   - API: http://localhost:3000
   - Swagger: http://localhost:3000/api

### Docker Commands

```bash
# Start PostgreSQL
pnpm docker:up

# Stop PostgreSQL
pnpm docker:down

# View logs
pnpm docker:logs
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | PostgreSQL user | postgres |
| `DB_PASSWORD` | PostgreSQL password | postgres |
| `DB_NAME` | Database name | books |
| `PORT` | API port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |

## Main Commands

```bash
# Development
pnpm start:dev          # Development mode (watch)
pnpm build              # Compile TypeScript
pnpm start:prod         # Production

# Testing
pnpm test               # Unit tests
pnpm test:e2e           # E2E tests

# Docker
pnpm docker:up          # Start PostgreSQL
pnpm docker:down        # Stop PostgreSQL
pnpm docker:logs        # View PostgreSQL logs

# Verification
npx tsc --noEmit        # Type check
pnpm lint               # Run linter
```

## Documentation

- [Index](./docs/00_INDEX.md)
- [Architecture](./docs/01_ARCHITECTURE.md)
- [Entities](./docs/02_ENTITIES.md)
- [Use Cases](./docs/03_USE_CASES.md)
- [API](./docs/04_API.md)
- [Testing](./docs/07_TESTING.md)
- [Use Case Pattern](./docs/USE_CASE_PATTERN.md)
