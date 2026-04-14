# Use Case Architecture Guide

> Understanding the Clean Architecture approach to use cases

---

## Table of Contents

1. [Summary](#summary)
2. [Use Case Isolation Pattern](#use-case-isolation-pattern)
3. [Folder Structure](#folder-structure)
4. [File Organization](#file-organization)
5. [Repository per Operation](#repository-per-operation)
6. [Domain-Driven Design](#domain-driven-design)
7. [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
8. [Transactional Pattern](#transactional-pattern)
9. [Boundary Protection](#boundary-protection)
10. [Use Case Documentation](#use-case-documentation)

---

## Summary

This architecture follows **Use Case Isolation** — a strict Clean Architecture pattern where each business operation is encapsulated in its own isolated folder with dedicated files for the use case implementation, data transfer objects (DTOs), and repository interfaces.

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Single Responsibility** | Each use case does exactly one thing |
| **Isolation** | No shared repositories between use cases |
| **Testability** | Each use case can be tested independently |
| **Discoverability** | Use case documentation lives next to the code |

### Why Documentation Lives with the Code

Co-locating README.md files next to use case implementations ensures:
- **Documentation stays current**: When code changes, the adjacent README is a visible reminder to update documentation
- **No guessing**: Looking at the folder immediately tells you what is implemented and documented
- **Code reviews include documentation**: PR reviewers see documentation changes alongside code changes
- **Offline availability**: No dependency on external documentation systems

---

## Use Case Isolation Pattern

### The Rule: One Operation = One Folder

Each CRUD (and business) operation has its own folder:

```
application/use-cases/{domain}/{action}-{entity}/
├── {action}-{entity}.use-case.ts              # Implementation
├── {action}-{entity}.request.dto.ts           # Input validation
├── {action}-{entity}.response.dto.ts          # Output shape
├── {action}-{entity}.repository.interface.ts  # Repository contract
└── README.md                                  # Use case documentation
```

### Why Not Fat Repositories?

Fat repositories may seem convenient, but they create significant architectural problems:

**Performance Issues**: Fat repositories encourage cross-use-case reuse, where unrelated operations get grouped. This leads to:
- **Over-fetching**: Loading data that specific use cases don't need
- **Extra database queries**: Generic methods often require multiple round-trips to satisfy specific use cases
- **Lock contention**: Broad transactions hold locks longer than necessary

**Poor Discoverability**: When something breaks, you have to guess which of the 15 fat repository methods might be involved. With isolated repositories, you start looking in exactly one place: the use case folder.

**Hidden Coupling**: "Let's just reuse the existing repository" seems efficient, but it couples unrelated use cases through shared data access patterns. Changes for one use case risk breaking others.

**Use Cases as Application Services**: Each use case is essentially an Application Service with a single responsibility. Repository per operation keeps service boundaries clean and prevents leaky abstractions.

**❌ NOT Allowed:**
```typescript
// Fat repository — couples use cases together
// If you need to optimize how contacts are listed,
// you risk breaking create, update, and delete
export interface IContactRepository {
    create(contact: Contact): Promise<Contact>;
    get(id: string): Promise<Contact | null>;
    list(userId: string): Promise<Contact[]>;        // Generic — often over-fetches
    update(contact: Contact): Promise<Contact>;
    delete(id: string): Promise<void>;
}
```

**✅ Correct:**
```typescript
// ICreateContactRepository.ts — hyper-specific for this operation
// Only queries needed for contact creation
export interface ICreateContactRepository {
    create(contact: Contact): Promise<Contact>;
    existsByEmail(userId: string, email: string): Promise<boolean>;
}

// IGetContactRepository.ts — separate file, separate concerns
// Can be optimized independently without affecting creation logic
export interface IGetContactRepository {
    getById(id: string): Promise<Contact | null>;
}
```

---

## Folder Structure

### Organized by Domain

Organize use cases by domain (bounded context), with each operation in its own folder:

```
application/use-cases/
├── auth/
│   ├── sign-up/
│   ├── sign-in/
│   └── complete-auth/
├── users/
│   ├── create-user/
│   ├── get-user/
│   └── list-users/
├── books/
│   ├── create-book/
│   ├── get-book/
│   ├── list-books/
│   ├── update-book/
│   └── delete-book/
└── [your-domain]/
    ├── [action]-[entity]/
    └── ...
```

---

## File Organization

### Standard Files per Use Case

Each use case folder contains these files:

| File | Purpose | Example |
|------|---------|---------|
| `{name}.use-case.ts` | Core use case logic | `create-book.use-case.ts` |
| `{name}.request.dto.ts` | Input validation | `create-book.request.dto.ts` |
| `{name}.response.dto.ts` | Output shape | `create-book.response.dto.ts` |
| `{name}.repository.interface.ts` | Repository contract | `create-book.repository.interface.ts` |
| `README.md` | Documentation | See [Use Case Documentation](#use-case-documentation) |

### Example: Create Book Use Case

```typescript
// create-book.use-case.ts
import { Book } from '../../../../domain/entities/book.entity';
import { CreateBookRequestDto } from './create-book.request.dto';
import { CreateBookResponseDto } from './create-book.response.dto';
import { ICreateBookRepository } from './create-book.repository.interface';

export class CreateBookUseCase {
    constructor(
        private readonly repository: ICreateBookRepository,
    ) {}

    async execute(dto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
        const isbnExists = await this.repository.existsByIsbn(dto.isbn);
        if (isbnExists) {
            throw new BadRequestException('A book with that ISBN already exists');
        }

        const book = Book.create({
            title: dto.title,
            author: dto.author,
            isbn: dto.isbn,
            publicationYear: dto.publicationYear,
            genre: dto.genre,
        });

        const created = await this.repository.create(book);
        return this.toResponseDto(created);
    }

    private toResponseDto(book: Book): CreateBookResponseDto {
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publicationYear: book.publicationYear,
            genre: book.genre,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        };
    }
}
```

---

## Repository per Operation

### Repository Interface Location

The use case **owns** its repository interface:

```typescript
// create-book.repository.interface.ts
export interface ICreateBookRepository {
    create(book: Book): Promise<Book>;
    existsByIsbn(isbn: string): Promise<boolean>;
}
```

### Repository Implementation Location

Implementations live in the Infrastructure layer:

```
infrastructure/database/repositories/{domain}/
├── create-{entity}.repository.ts
├── get-{entity}.repository.ts
├── list-{entity}s.repository.ts
├── update-{entity}.repository.ts
└── delete-{entity}.repository.ts
```

### Module Registration

Register each repository implementation with its interface token:

```typescript
// books.module.ts
providers: [
    { provide: 'ICreateBookRepository', useClass: CreateBookRepository },
    { provide: 'IGetBookRepository', useClass: GetBookRepository },
    // ... one per use case
]
```

---

## Domain-Driven Design

### Why Pure Domain Entities?

Domain entities without framework dependencies:
- **Testable without infrastructure**: Run unit tests without a database or any framework
- **Portable logic**: Business rules can move between frameworks (Express, Fastify, etc.)
- **Explicit business intent**: Methods like `updateTitle()` express domain concepts, not technical operations
- **Immutable state changes**: State changes happen through methods, not direct property assignment

### Domain Entity Usage

Use cases operate on pure domain entities:

```typescript
// Domain entity — no framework decorators
export class Book {
    private readonly _id: string;
    private _title: string;
    private _updatedAt: Date;

    static create(props: { title: string; ... }): Book {
        return new Book(uuidv7(), props.title, new Date());
    }

    // Domain behavior expressed as methods, not property setters
    updateTitle(title: string): void {
        this._title = title;
        this._updatedAt = new Date();
    }

    // Read-only properties exposed via getters
    get id(): string { return this._id; }
    get title(): string { return this._title; }
}
```

### Factory Pattern

Always use factory methods, never constructors:

```typescript
// ✅ Correct
const book = Book.create({...});

// ❌ Wrong — constructor is private
const book = new Book(...);
```

### Why Factory Methods?

Factory methods provide architectural benefits that constructors cannot:

**Named Construction**: `Book.create()` vs `new Book(...)` — the intent is clear from the method name, not from positional arguments. Constructors are always named after the class; factories can have descriptive names for each creation scenario.

**Testability**: You can stub or spy on `Book.create` in tests, which is impossible with the `new` operator. This allows tests to control object creation without dependency injection frameworks.

### Why Behavior Through Methods?

Domain behavior is expressed as methods, not property setters:

```typescript
// ✅ Business intent is clear
book.updateTitle('New Title');

// ❌ What does this operation mean in domain terms?
book.title = 'New Title';
```

**Encapsulation**: Methods hide internal state changes. `updateTitle()` sets the field and updates the timestamp — callers don't need to know.

**Invariant Checking**: Methods validate before changing state. Direct assignment cannot.

**Domain Language**: Methods named after business concepts (`publish()`, `archive()`) make code readable to domain experts.

### Why Getters?

Exposing read-only properties via getters:

```typescript
get id(): string { return this._id; }
```

**Read-Only Access**: External code can observe state but cannot corrupt it via direct assignment.

**Encapsulation**: Internal representation can change (e.g., `_id` becomes a Value Object) without affecting callers.

**Computed Properties**: Getters can derive values on demand without storing redundant state.

---

## Data Transfer Objects (DTOs)

### Why DTOs?

DTOs decouple internal domain models from external interfaces:

```typescript
// Request DTO — what the caller provides
export class CreateBookRequestDto {
    title: string;
    author: string;
    isbn: string;
    publicationYear: number;
    genre?: string;
}

// Response DTO — what the use case returns
export class CreateBookResponseDto {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publicationYear: number;
    genre: string | null;
    createdAt: Date;
    updatedAt: Date;
}
```

**Validation Separation**: Request DTOs validate at the boundary (using validation libraries) before data reaches domain logic. Invalid inputs are rejected early.

**Contract Stability**: The API contract (DTOs) can remain stable while the domain model evolves. Adding a field to the Book entity does not automatically expose it to callers.

**Security**: DTOs prevent accidental data leakage. Sensitive fields are not exposed unless explicitly included in the response DTO.

**Decoupling**: Changes to the domain (e.g., splitting `title` into `shortTitle` and `subtitle`) don't require changes to callers if the DTO remains compatible.

### Mapping Layers

Use cases act as the mapping layer between DTOs and domain entities:

```typescript
// Request DTO → Domain Entity
const book = Book.create({
    title: request.title,
    author: request.author,
    isbn: request.isbn,
    publicationYear: request.publicationYear,
    genre: request.genre ?? null,
});

// Domain Entity → Response DTO
return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    publicationYear: book.publicationYear,
    genre: book.genre,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
};
```

---

## Transactional Pattern

### Why Transactions Are Mandatory

Without explicit transactions:
- **Partial failures**: Database operations may complete partially, leaving data in inconsistent states
- **Connection leaks**: Uncommitted work holds database connections open longer
- **Race conditions**: Concurrent operations see intermediate states
- **Impossible rollback**: Errors after partial writes cannot be cleanly undone

### All DB Operations Must Be Transactional

```typescript
// ✅ Correct
async create(book: Book): Promise<Book> {
    return await this.orm.em.transactional(async (em) => {
        const saved = await em.persist(book).flush();
        return saved;
    });
    // Transaction automatically committed on success,
    // rolled back on error
}

// ❌ Wrong — never outside a transaction
await this.em.persist(book).flush();
// If this fails, the entity may be partially persisted
// with no way to roll back
```

---

## Boundary Protection

### Repositories Work with Entities

Repositories are the bridge between domain and infrastructure. They accept and return domain entities, not database rows or ORM objects:

```typescript
// ✅ Repository accepts and returns domain entities
export interface ICreateBookRepository {
    create(book: Book): Promise<Book>;
}

// Implementation maps between entity and persistence model
class CreateBookRepository implements ICreateBookRepository {
    async create(book: Book): Promise<Book> {
        const entity = this.em.create(BookEntity, {
            id: book.id,
            title: book.title,
            author: book.author,
        });
        await this.em.persist(entity).flush();
        return book;  // Return the domain entity, not the ORM entity
    }
}
```

**Domain Integrity**: The domain model stays pure. The repository handles the complicated mapping between entities and persistence structures.

**Swappable Infrastructure**: You can switch from SQL to MongoDB without touching use cases — only repository implementations change.

**Testability**: Repositories can be mocked with in-memory implementations that work with entities, no database required.

**No Leaky Abstractions**: Callers never see database specifics (table names, column types, JOINs). They work only with domain concepts.

### Use Cases Don't Call Each Other

Each use case is a standalone entry point. They never invoke each other directly:

```typescript
// ❌ WRONG — use cases calling each other
export class CreateOrderUseCase {
    constructor(
        private readonly getProductUseCase: GetProductUseCase,  // Don't do this
    ) {}
}
```

```typescript
// ✅ CORRECT — use case orchestrates via repository
export class CreateOrderUseCase {
    constructor(
        private readonly repository: ICreateOrderRepository,
    ) {}

    async execute(request: CreateOrderRequest) {
        const productIds = request.items.map(item => item.productId);
        const existenceMap = await this.repository.productsExist(productIds);
        const missingProducts = productIds.filter(id => !existenceMap[id]);
        if (missingProducts.length > 0) {
            throw new ProductNotFoundError(`Products not found: ${missingProducts.join(', ')}`);
        }

        const order = Order.create({ items: request.items });
        return this.repository.create(order);
    }
}
```

**Single Entry Point**: Each use case represents a user intent. If you need the same logic in two places, extract the shared domain logic into the entity or a domain service, not into another use case.

**Transaction Boundaries**: Each use case defines its own transactional scope. Calling another use case could commit or roll back data unexpectedly.

**Testability**: Use cases without dependencies on other use cases are easier to test in isolation.

**Reusability Through Domain**: Shared logic belongs in the domain (entities, value objects, domain services), not in use cases. Use cases orchestrate; domains encapsulate business rules.

---

## Use Case Documentation

### Where to Find Documentation

Each use case folder contains a `README.md` with:
- Use case ID and description
- Actors and stakeholders
- Preconditions and postconditions
- Main flow and alternative flows
- Business rules
- Sequence diagrams
- Error scenarios

### Example Structure

```markdown
# UC-BOO-001: Create Book

## Summary
Description and trigger information

## Actors
- Primary: API Client
- Secondary: System

## Preconditions
- P1: ISBN is not already registered

## Postconditions
- PS1: Book persisted in database
- PS2: ID returned in response

## Main Flow
1. Validate input
2. Check for duplicate ISBN
3. Create domain entity
4. Persist
5. Return response

## Alternative Flows
- AF-1: Duplicate ISBN → 400 Bad Request
- AF-2: Invalid input → 400 Bad Request

## Sequence Diagram
```mermaid
...
```
```

### Accessing Use Case Documentation

Navigate to any use case folder to find its documentation:

```bash
cd application/use-cases/{domain}/{action}-{entity}/
cat README.md
```

---

## Adding a New Use Case

1. **Create folder** in the appropriate domain
2. **Create 4 files**: use-case, request-dto, response-dto, repository-interface
3. **Create README.md** with documentation
4. **Implement repository** in the infrastructure layer
5. **Register in the module** providers

### Checklist

- [ ] Folder created: `application/use-cases/{domain}/{action}-{entity}/`
- [ ] Request DTO validates input
- [ ] Response DTO defines output shape
- [ ] Repository interface defined in the use case folder
- [ ] Repository implementation in the infrastructure layer
- [ ] README.md with complete documentation
- [ ] Registered in the dependency injection container
