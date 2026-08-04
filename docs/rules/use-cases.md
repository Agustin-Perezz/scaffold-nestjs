# Use Case Rules

Rules for `src/application/use-cases/`. Loaded via `opencode.json`.

## One Operation = One Folder

Each business operation gets its own folder with dedicated files:

```
application/use-cases/{domain}/{action}-{entity}/
├── {action}-{entity}.use-case.ts              # Implementation
├── {action}-{entity}.request.dto.ts           # Input validation
├── {action}-{entity}.response.dto.ts          # Output shape
├── {action}-{entity}.repository.interface.ts  # Repository contract
└── README.md                                  # Use case documentation
```

## One Repository Per Operation

Each use case owns its repository interface. No fat repositories.

```typescript
// ✅ Correct — specific repository per operation
export interface ICreateBookRepository {
  create(book: Book): Promise<Book>;
  existsByIsbn(isbn: string): Promise<boolean>;
}

// ❌ Wrong — fat repository couples use cases
export interface IBookRepository {
  create(book: Book): Promise<Book>;
  get(id: string): Promise<Book>;
  list(): Promise<Book[]>;
  update(book: Book): Promise<Book>;
  delete(id: string): Promise<void>;
}
```

## Use Cases Don't Call Each Other

Each use case is a standalone entry point. Never inject another use case.

```typescript
// ❌ Wrong — use case calling another use case
export class CreateOrderUseCase {
  constructor(
    private readonly getProductUseCase: GetProductUseCase, // Don't
  ) {}
}

// ✅ Correct — orchestrate via repository
export class CreateOrderUseCase {
  constructor(
    private readonly repository: ICreateOrderRepository,
  ) {}
}
```

Shared logic belongs in the domain (entities, value objects, domain services),
not in use cases. Use cases orchestrate; domains encapsulate business rules.

## FK Existence Validation Ordering

When a use case validates both a foreign key existence and other business
constraints, validate FK existence FIRST. A missing FK (404) takes
precedence over business constraint violations (400) — you can't violate
a business rule for an entity that references something that doesn't exist.

```typescript
// ✅ Correct — FK check first, business check second
async execute(dto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
  const author = await this.repository.findAuthorById(dto.authorId);
  if (!author) throw new NotFoundException('Author not found');

  const isbnExists = await this.repository.existsByIsbn(dto.isbn);
  if (isbnExists) throw new BadRequestException('ISBN already exists');

  // ... create book
}
```

See `docs/rules/relations.md` for the full FK validation pattern.

## DTOs at the Boundary

Request DTOs validate input at the boundary (using `class-validator`).
Response DTOs define the output shape. Use cases map between DTOs and domain
entities.

```typescript
// Request DTO → Domain Entity
const book = Book.create({ title: dto.title, ... });

// Domain Entity → Response DTO
return { id: book.id, title: book.title, ... };
```

DTOs decouple the domain model from the API contract. Adding a field to the
entity does not automatically expose it to callers.

## Use Case Shape

```typescript
export class CreateBookUseCase {
  constructor(
    @Inject('ICreateBookRepository')
    private readonly repository: ICreateBookRepository,
  ) {}

  async execute(dto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
    // Implementation
  }
}
```

## Module Registration

Register each repository implementation with its interface token:

```typescript
// books.module.ts
providers: [
  { provide: 'ICreateBookRepository', useClass: CreateBookRepository },
  { provide: 'IGetBookRepository', useClass: GetBookRepository },
  CreateBookUseCase,
  // ... one per use case
]
```