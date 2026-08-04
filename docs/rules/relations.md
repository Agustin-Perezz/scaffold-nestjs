# Relations Rules

Rules for modeling relationships between entities. Loaded via `opencode.json`.

## FK as Plain ID String

Foreign keys are stored as plain `string` IDs in domain entities, never as
typed ORM references. This keeps the domain layer pure (no ORM imports) and
matches the "no decorators in domain" rule.

```typescript
// ✅ Correct — FK is a plain string
export class Book extends BaseEntity {
  private _authorId: string;
  get authorId(): string { return this._authorId; }
}

// ❌ Wrong — typed ORM reference leaks infrastructure into domain
import { Author } from './author.entity';
export class Book extends BaseEntity {
  private _author: Author; // no object references in domain
}
```

In the MikroORM entity, the FK is a `p.uuid()` column, not a `@ManyToOne`
relation. This avoids lazy-loading surprises and keeps queries explicit.

```typescript
// ✅ Correct
const BookEntitySchema = defineEntity({
  properties: {
    authorId: p.uuid(),
    // ...
  },
});

// ❌ Wrong — ORM relation in infrastructure entity
properties: {
  author: p.manyToOne(() => AuthorEntity), // no implicit relations
}
```

## Schema Registration

A module MUST register every entity schema its repositories inject. If a
repository in `BooksModule` queries `AuthorEntity` (for FK validation),
`BooksModule` must register `AuthorEntitySchema` in `MikroOrmModule.forFeature`.

```typescript
// books.module.ts
@Module({
  // CreateBookRepository and UpdateBookRepository inject AuthorEntity
  // to validate FK existence — so AuthorEntitySchema must be registered here.
  imports: [MikroOrmModule.forFeature([BookEntitySchema, AuthorEntitySchema])],
})
export class BooksModule {}
```

Rule of thumb: if a repo's constructor has `@InjectRepository(XEntity)`,
`XEntitySchema` must be in the module's `forFeature`.

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