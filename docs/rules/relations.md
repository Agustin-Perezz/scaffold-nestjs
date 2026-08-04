# Relations Rules

Rules for modeling relationships between entities. Loaded via `opencode.json`.

## Hybrid Pattern: Pure Domain + ORM Relations in Infrastructure

Domain entities keep foreign keys as plain `string` IDs — no ORM imports, no
typed references. Infrastructure entities (MikroORM) declare ORM relations
(`p.manyToOne`, `p.oneToMany`, `p.manyToMany`) for joins, cascade, and
constraints. The repository maps between the two.

This gives you: pure domain for business rules, ORM power for queries and
constraints, at the cost of a mapping layer in each repository.

### Domain entity — plain FK string

```typescript
// ✅ Domain — pure, no ORM imports
export class Book extends BaseEntity {
  private _authorId: string;
  get authorId(): string { return this._authorId; }
}

// ❌ Wrong — typed reference leaks infrastructure into domain
import { Author } from './author.entity';
export class Book extends BaseEntity {
  private _author: Author;
}
```

### Infrastructure entity — ORM relation + FK column

The MikroORM entity declares both the relation (for joins/populate/cascade)
and keeps the FK column explicit (for trivial domain mapping). The FK column
is the source of truth for `toDomain`; the relation is the source of truth
for queries.

```typescript
// ✅ Infrastructure — relation + FK column coexist
const BookEntitySchema = defineEntity({
  properties: {
    // FK column — used by toDomain mapping (always available, no lazy-load)
    authorId: p.uuid(),
    // ORM relation — used for populate(), joins, cascade, FK constraint
    author: () => p.manyToOne(AuthorEntitySchema),
  },
});
```

```typescript
// ✅ Repository mapping — read FK column, not the relation
private toDomain(entity: BookEntity): Book {
  return Book.reconstruct({
    id: entity.id,
    authorId: entity.authorId, // FK column, always populated
    // ...
  });
}
```

Why both: reading `entity.authorId` is always safe (column is loaded with
the row). Reading `entity.author.id` can trigger a lazy-load if the relation
wasn't populated — an N+1 trap. The FK column keeps mapping trivial; the
relation gives you ORM features when you opt in via `populate`.

## Schema Registration

A module MUST register every entity schema its repositories inject. If a
repository in `BooksModule` queries `AuthorEntity` (for FK validation or
joins), `BooksModule` must register `AuthorEntitySchema` in
`MikroOrmModule.forFeature`.

```typescript
// books.module.ts
@Module({
  imports: [MikroOrmModule.forFeature([BookEntitySchema, AuthorEntitySchema])],
})
export class BooksModule {}
```

Rule of thumb: if a repo's constructor has `@InjectRepository(XEntity)`,
`XEntitySchema` must be in the module's `forFeature`. If a relation
references `YEntity`, `YEntitySchema` must also be registered.

## Eager Loading via `populate`

Use the ORM relation for eager loading related data in one query. The
repository calls `populate` on the relation name, then maps to domain.

```typescript
// ✅ Load book with author in one query
async findByIdWithAuthor(id: string): Promise<Book | null> {
  const entity = await this.repository.findOne({ id }, { populate: ['author'] });
  // entity.author is loaded, no extra query
  return this.toDomain(entity);
}
```

Without `populate`, accessing `entity.author` triggers a lazy-load query.
For mapping, always read the FK column (`entity.authorId`), never the
relation. For queries that need the related entity, use `populate`.

## FK Validation in Use Cases

The use case validates that an FK target exists before creating or updating.
The repository exposes a `find{Entity}ById` method for this; the use case
throws `NotFoundException` if the FK target is missing.

```typescript
// ✅ Correct — use case validates FK
async execute(dto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
  const author = await this.repository.findAuthorById(dto.authorId);
  if (!author) {
    throw new NotFoundException('Author not found');
  }
  // ... proceed with book creation
}
```

The FK validation method (`findAuthorById`) lives on the same repository
interface as the operation — not on a separate fat repository. See
`docs/rules/use-cases.md` "One Repository Per Operation".

## FK Validation Ordering

When a use case validates both FK existence and other business rules (e.g.
duplicate ISBN), FK existence is validated FIRST. A missing FK is a
"reference doesn't exist" error (404) and takes precedence over business
constraint violations (400).

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

## One-to-Many

The "one" side declares `p.oneToMany().mappedBy('author')` if you need a
collection (eager loading an author's books, cascade delete). If you only
ever query from the "many" side (`find({ authorId })`), you can skip the
inverse collection — the FK column on the "many" side is enough.

```typescript
// Author — one side (optional collection)
const AuthorSchema = defineEntity({
  properties: {
    books: () => p.oneToMany(BookSchema).mappedBy('author'),
  },
});

// Book — many side (always declare the relation + FK)
const BookSchema = defineEntity({
  properties: {
    authorId: p.uuid(),
    author: () => p.manyToOne(AuthorSchema),
  },
});
```

## Many-to-Many — Junction Table

Model many-to-many with an explicit junction entity. Each side has a
`p.manyToMany()` referencing the other through the pivot.

```typescript
// BookTag — junction entity
const BookAuthorSchema = defineEntity({
  tableName: 'book_authors',
  properties: {
    bookId: p.uuid(),
    book: () => p.manyToOne(BookSchema),
    authorId: p.uuid(),
    author: () => p.manyToOne(AuthorSchema),
  },
});

// Book — many-to-many through junction
const BookSchema = defineEntity({
  properties: {
    authors: () => p.manyToMany(AuthorSchema).through(BookAuthorSchema),
  },
});
```

The junction entity can carry its own fields (e.g. `contribution: string`
for "co-author" vs "translator"). Domain maps to plain FK pairs; infrastructure
uses the ORM relations for queries.

## Cross-Entity Queries

A repository may query multiple entities when its use case needs them. The
`ListBooksByAuthorRepository` injects both `AuthorEntity` and `BookEntity`
because its operation (list books by author) needs both. This is not a fat
repository — the interface is scoped to one operation, it just happens to
touch two tables.

```typescript
export interface IListBooksByAuthorRepository {
  findAuthorById(id: string): Promise<Author | null>;
  findBooksByAuthorId(authorId: string): Promise<Book[]>;
}
```

Both entity schemas must be registered in the module that provides this
repository.

## Cascade Operations

ORM relations make cascade declarative. Set `onDelete` on the "one" side to
cascade deletes to the "many" side.

```typescript
const AuthorSchema = defineEntity({
  properties: {
    books: () => p.oneToMany(BookSchema).mappedBy('author'),
  },
});
// Deleting an author cascades to its books via the FK constraint.
```

Without ORM relations, cascade requires a manual transaction across repos.
Prefer the declarative form when the relation exists.

## When to Use ORM Relations vs Plain FK Only

**Use ORM relations when** you need joins, eager loading, cascade, or FK
constraints generated from schema. This is the default for relations that
will be queried together.

**Use plain FK only (no relation) when** the relation is purely structural
and you never query through it. Rare — most relations benefit from at least
the FK constraint the ORM relation generates.