# Scaffold NestJS

NestJS + Clean Architecture + MikroORM 7. Four layers: domain, application,
infrastructure, presentation. One repository per use case. Mandatory
transactions. UUIDv7 IDs.

## Project Layout

```
scaffold-nestjs/
├── src/
│   ├── domain/
│   │   └── entities/           # Pure domain entities (no decorators)
│   ├── application/
│   │   └── use-cases/          # One folder per operation
│   │       ├── autos/
│   │       ├── clientes/
│   │       └── reservas/
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── entities/       # MikroORM entities (defineEntity)
│   │   │   └── repositories/   # Repository implementations
│   │   └── config/
│   └── presentation/
│       └── controllers/        # REST controllers
├── docs/
│   ├── rules/                  # AI rules by layer (loaded via opencode.json)
│   └── checklists/             # Step-by-step checklists for common tasks
├── opencode.json               # Loads AGENTS.md + docs/rules/* + docs/checklists/*
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Stack

- **Runtime**: Node.js
- **Framework**: NestJS 11.x
- **ORM**: MikroORM 7.x (`defineEntity`, no decorators)
- **Database**: PostgreSQL (SQLite in-memory for e2e tests)
- **Validation**: class-validator
- **Docs**: Swagger (OpenAPI 3.0)
- **Testing**: Jest 30 + Supertest
- **Seeding**: `@mikro-orm/seeder`, `@faker-js/faker`

## Commands

```bash
# Development
npm run start:dev        # Watch mode
npm run build            # Compile

# Verification
npx tsc --noEmit         # Type check
pnpm lint                # Lint
pnpm check               # Lint + format + organize imports

# Testing
pnpm test                # Unit tests (domain entities)
pnpm test:e2e            # E2E tests (SQLite in-memory, no Docker)
pnpm test:cov            # Unit tests + coverage (coverage/unit/)
pnpm test:e2e:cov        # E2E tests + coverage (coverage/e2e/)
```

## URLs

| Service   | URL                          |
|-----------|------------------------------|
| API       | http://localhost:3000        |
| Swagger   | http://localhost:3000/api    |
| Database  | PostgreSQL (see docker-compose.yml) |

## Rules and Checklists

Rules and checklists live in `docs/` and are loaded automatically by OpenCode
via `opencode.json`:

- `docs/rules/domain.md` — pure domain, no decorators, factory methods
- `docs/rules/use-cases.md` — one folder per operation, DTOs, interfaces
- `docs/rules/repositories.md` — one repo per operation, transactions
- `docs/rules/relations.md` — FK as plain ID string, schema registration, FK validation
- `docs/rules/testing.md` — unit + e2e patterns, coverage scope
- `docs/checklists/new-domain.md` — add a new domain (autos, clientes, etc.)
- `docs/checklists/new-use-case.md` — add a new use case to an existing domain
- `docs/checklists/new-entity.md` — add a new entity to an existing domain

## Code Locations

- `src/domain/entities/` — Domain entities
- `src/application/use-cases/` — Use cases (one folder per operation)
- `src/infrastructure/` — Repository implementations, MikroORM, config
- `src/presentation/` — Controllers, DTOs, Swagger