# Testing Rules

Rules for unit and e2e tests. Loaded via `opencode.json`.

## Two Layers

- **Unit tests** (`src/**/*.spec.ts`) — pure domain logic in isolation. No
  mocks, no Nest module, no database.
- **E2E tests** (`test/**/*.e2e-spec.ts`) — full HTTP stack on in-memory SQLite.
  Supertest per controller.

## Unit Tests

Unit tests cover `src/domain/entities/` only. No `TestingModule`, no providers
array, no mocks — just `import` + `expect`.

```typescript
import { Book } from './book.entity';

describe('Book', () => {
  it('creates a book with generated UUIDv7 and timestamps', () => {
    const book = Book.create({ /* ... */ });
    expect(book.id).toMatch(/^[0-9a-f-]+-7[0-9a-f-]+$/);
    expect(book.createdAt).toBeInstanceOf(Date);
  });
});
```

## E2E Tests

E2E tests use SQLite in-memory (`:memory:`) — no Docker, no PostgreSQL.

- `createTestApp()` (in `test/helpers/app.helper.ts`) builds a Nest app backed
  by in-memory SQLite and refreshes the schema once in `beforeAll`.
- `truncateAll(orm)` clears all rows in `beforeEach`.
- Seed known records directly into the DB via factories
  (`BookFactory.createOne(overrides)`), not through HTTP.
- Use this factory pattern for every new entity.

```typescript
beforeAll(async () => {
  ({ app, orm } = await createTestApp(BooksModule, [BookEntitySchema]));
});

beforeEach(async () => {
  await truncateAll(orm);
  const book = await new BookFactory(orm.em).createOne({ /* ... */ });
  bookId = book.id;
});

afterAll(async () => {
  await app.close();
});
```

### Factories with Foreign Keys

When an entity has a FK (e.g. `Book.authorId`), the factory generates a
random UUID by default. Tests that need a real, persisted FK target must
create the parent entity first and pass its ID as an override.

```typescript
// ✅ Correct — create author, pass its ID to the book factory
beforeEach(async () => {
  await truncateAll(orm);

  const author = await new AuthorFactory(orm.em).createOne({ name: 'Andrew Hunt' });
  authorId = author.id;

  const book = await new BookFactory(orm.em).createOne({
    title: 'The Pragmatic Programmer',
    authorId, // override the random UUID with a real FK
    isbn: '978-0135957059',
    publicationYear: 1999,
  });
  bookId = book.id;
});
```

Both factories must be registered with the ORM for the test. The factory's
`definition()` returns a random UUID for the FK — it doesn't create the
parent. This keeps factories independent; the test wires the relation.

```typescript
// BookFactory — random FK by default, override in tests
export class BookFactory extends Factory<BookEntity> {
  model = BookEntity;
  definition(): Partial<BookEntity> {
    return {
      title: faker.book.title(),
      authorId: uuidv7(), // random; tests override with a real author ID
      // ...
    };
  }
}
```

## Coverage

Both Jest configs enforce 60/50 threshold (lines/functions/statements: 60,
branches: 50). Build fails if any metric drops below.

- Unit coverage: `src/domain/entities/` only. Application, infrastructure,
  presentation excluded — covered by E2E.
- E2E coverage: all `src/**/*.ts` except `main.ts` and `.spec.ts` files.

## ESM Transform

MikroORM 7, uuid 14, and `@faker-js/faker` are ESM-only. `@swc/jest` transforms
them to CJS. `transformIgnorePatterns` in both Jest configs whitelists
`@mikro-orm`, `kysely`, `uuid`, and `@faker-js`.