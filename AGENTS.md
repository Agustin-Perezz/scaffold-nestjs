# How to Use This Project with AI

> This project is a clone of [r-argentina-programa/arquitectura](https://github.com/r-argentina-programa/arquitectura/tree/main).

> Guide for understanding the structure of this project and how AI is used in development

## Introduction

This project was built entirely with AI assistance. This document explains:
1. The project structure
2. How AI was used during development
3. How to continue working with AI in this project
4. Best practices for AI-assisted development

---

## Project Structure

### Project Layout

```
scaffold-nestjs/
├── src/
│   ├── domain/
│   │   └── entities/           # Pure domain entities
│   ├── application/
│   │   └── use-cases/         # Use cases
│   │       ├── autos/         # Auto use cases
│   │       ├── clientes/      # Client use cases
│   │       └── reservas/      # Reservation use cases
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── entities/     # MikroORM entities
│   │   │   └── repositories/ # Repository implementations
│   │   └── config/           # Configuration
│   └── presentation/
│       └── controllers/       # REST controllers
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Clean Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                           │
│        (Controllers, DTOs, Pipes, Filters, Swagger)            │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│          (Use Cases, Repository Interfaces, DTOs)               │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Domain Layer                              │
│           (Pure Entities - NO Framework Decorators)             │
└─────────────────────────────────────────────────────────────────┘
                               ▲
                               │
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                          │
│    (Repository Implementations, MikroORM, Services)             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Rules

1. **Domain Layer** - No framework decorators, pure TypeScript
2. **Application Layer** - Use cases with repository interfaces
3. **Infrastructure Layer** - Repository implementations, external services
4. **Presentation Layer** - Controllers, validation, Swagger

---

## How AI Was Used

### Development Approach

This project was developed using Claude Code with the following workflow:

1. **Planning Phase**
   - AI analyzed the requirements
   - Generated architecture proposals
   - Created documentation first

2. **Implementation Phase**
   - AI generated code based on the architecture
   - Incremental feature development
   - Continuous documentation updates

3. **Review Phase**
   - AI reviewed code for consistency
   - Verified architectural compliance
   - Generated test cases

### AI-Generated Components

| Component | AI Generated | Notes |
|-----------|--------------|-------|
| Domain Entities | ✅ 100% | Pure TypeScript with factory methods |
| Use Cases | ✅ 100% | One per operation pattern |
| Repositories | ✅ 100% | One per use case pattern |
| MikroORM Entities | ✅ 100% | With decorators |
| Controllers | ✅ 100% | With Swagger |
| DTOs | ✅ 100% | With class-validator |
| Documentation | ✅ 100% | This file |

---

## Working with AI in This Project

### Getting Started

1. **Read AGENTS.md First**
   ```bash
   cat AGENTS.md
   ```
   This file contains critical constraints and patterns.

2. **Read Relevant Documentation**
   - Review ADR-0001 to ADR-0009 in docs/adr/

3. **Understand the Architecture**
   - Clean Architecture with 4 layers
   - One repository per use case
   - Mandatory transactions with MikroORM

### Adding New Features

#### Step 1: Domain Entity

```typescript
// src/domain/entities/[entity].entity.ts
export class [Entity] {
    private readonly _id: string;
    // ... other private properties

    static create(props: { ... }): [Entity] {
        return new [Entity](uuidv7(), ...);
    }

    static reconstruct(props: { ... }): [Entity] {
        return new [Entity](...);
    }

    // Domain methods
}
```

#### Step 2: Use Case

```typescript
// src/application/use-cases/[domain]/[action]-[entity]/
// [action]-[entity].use-case.ts
@Injectable()
export class [Action][Entity]UseCase {
    constructor(
        @Inject('I[Action][Entity]Repository')
        private readonly repository: I[Action][Entity]Repository,
    ) {}

    async execute(request: [Action][Entity]RequestDto): Promise<[Action][Entity]ResponseDto> {
        // Implementation
    }
}

// [action]-[entity].repository.interface.ts
export interface I[Action][Entity]Repository {
    [action](entity: [Entity]): Promise<[Entity]>;
}
```

#### Step 3: Repository Implementation

```typescript
// src/infrastructure/database/repositories/[domain]/[action]-[entity].repository.ts
@Injectable()
export class [Action][Entity]Repository implements I[Action][Entity]Repository {
    constructor(
        @InjectRepository([Entity]Entity)
        private readonly repository: EntityRepository<[Entity]Entity>,
        private readonly orm: MikroORM,
    ) {}

    async [action](entity: [Entity]): Promise<[Entity]> {
        return this.orm.em.transactional(async (em) => {
            // Implementation
        });
    }
}
```

#### Step 4: Register in Module

```typescript
// src/app.module.ts
providers: [
    {
        provide: 'I[Action][Entity]Repository',
        useClass: [Action][Entity]Repository,
    },
]
```

#### Step 5: Controller

```typescript
// src/presentation/controllers/[domain]/
@ApiTags('[domain]')
@Controller('[domain]')
export class [Domain]Controller {
    constructor(
        private readonly [action][Entity]UseCase: [Action][Entity]UseCase,
    ) {}

    @Post()
    async [action](@Body() dto: [Action][Entity]RequestDto) {
        return this.[action][Entity]UseCase.execute(dto);
    }
}
```

---

## AI Patterns

### 1. Always Reference AGENTS.md

The constraints in AGENTS.md are critical:
- Do not create "fat" repositories
- Do not create barrel files
- Do not pollute the domain with decorators
- Always use transactions
- UUIDv7 for IDs

### 2. Document First, Code After

Before implementing, document:
- Add use case to USE_CASES.md
- Update entities in DOMAIN_ENTITIES.md
- Create an ADR if there is an architectural decision

### 3. Verify Incrementally

```bash
# Check types
npx tsc --noEmit

# Check lint
npm run lint

# Check build
npm run build
```

### 4. Use Direct Imports

```typescript
// CORRECT
import { Auto } from '../../../../domain/entities/auto.entity';

// INCORRECT - Do not use barrel files
import { Entities } from '../../domain';
```

### 5. Keep the Domain Pure

```typescript
// CORRECT - No decorators
export class Auto {
    private readonly _id: string;
}

// INCORRECT
@Entity()  // ❌ Not in domain
export class Auto {}
```

### 6. One Repository Per Operation

```typescript
// CORRECT
export interface ICreateAutoRepository { }
export interface IGetAutoRepository { }

// INCORRECT
export interface IAutoRepository {  // ❌ Fat repository
    create();
    get();
    list();
    update();
    delete();
}
```

### 7. Always Use Transactions

```typescript
// CORRECT
return this.orm.em.transactional(async (em) => {
    await em.persist(entity).flush();
});

// INCORRECT
await this.repository.getEntityManager().persist(entity).flush();
```

---

## Common Tasks

### Adding a New Domain

1. Create entity in `domain/entities/`
2. Create MikroORM entity in `infrastructure/database/entities/`
3. Create use cases in `application/use-cases/[domain]/`
4. Create repositories in `infrastructure/database/repositories/[domain]/`
5. Create controller in `presentation/controllers/[domain]/`
6. Update `AppModule` with repositories
7. Update `AppModule` with use cases

### Modifying an Entity

1. Update domain entity
2. Update MikroORM entity
3. Update repositories that use it
4. Verify everything compiles

### Useful Commands

```bash
# Development
npm run start:dev        # Start in development mode
npm run build            # Compile

# Verification
npx tsc --noEmit         # Check types
```

---

## Resources

### Documentation
- `AGENTS.md` - AI constraints and patterns
- `docs/` - Full architecture documentation

### Code Locations
- `src/domain/entities/` - Domain entities
- `src/application/use-cases/` - Use cases
- `src/infrastructure/` - External services and repositories
- `src/presentation/` - Controllers

### Commands
```bash
# Development
npm run start            # Start
npm run start:dev        # Start in watch mode
npm run build            # Compile

# Verification
npx tsc --noEmit         # Check types
```

---

## Tips for Working with AI

1. **Be Specific** - Don't say "fix it", say "fix the type error on line 45"
2. **Provide Context** - Reference similar code, docs, patterns
3. **Iterate** - Start small, review, then expand
4. **Verify** - Always review AI-generated code
5. **Document** - Update docs as you go
6. **Test** - Verify that changes work
7. **Commit Often** - Small, focused commits

---

*This project is a testament to AI-assisted development. The combination of Clean Architecture, comprehensive documentation, and AI tools enables fast and maintainable development.*

*Last Updated: April 2026*
