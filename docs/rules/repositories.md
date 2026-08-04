# Repository Rules

Rules for `src/infrastructure/database/repositories/`. Loaded via `opencode.json`.

## One Repository Per Operation

Repository implementations live in the infrastructure layer, one per use case:

```
infrastructure/database/repositories/{domain}/
├── create-{entity}.repository.ts
├── get-{entity}.repository.ts
├── list-{entity}s.repository.ts
├── update-{entity}.repository.ts
└── delete-{entity}.repository.ts
```

Each implements the interface owned by its use case. No shared repositories
between use cases.

## Mandatory Transactions

All **write** operations (create, update, delete) MUST be wrapped in
transactions. Reads (find, findOne, count, exists) do NOT require
transactions — wrapping them adds overhead with no benefit.

```typescript
// ✅ Correct — write wrapped in transaction
async create(book: Book): Promise<Book> {
  return this.repository.getEntityManager().transactional(async (em) => {
    const entity = new BookEntity(book.title, book.authorId, book.isbn, book.publicationYear);
    entity.id = book.id;
    entity.genre = book.genre;
    entity.createdAt = book.createdAt;
    entity.updatedAt = book.updatedAt;
    await em.persist(entity).flush();
    return book;
  });
}

// ✅ Correct — read unwrapped
async findById(id: string): Promise<Book | null> {
  const entity = await this.repository.findOne({ id });
  return entity ? this.toDomain(entity) : null;
}

// ❌ Wrong — write without transaction
async create(book: Book): Promise<Book> {
  await this.em.persist(book).flush();
  return book;
}
```

### The forked `em` inside `transactional`

The `em` parameter inside the callback is a **forked entity manager** — it has
its own identity map and transaction context. Use it, not `this.repository`
or `this.em`, for all operations inside the callback.

```typescript
// ✅ Correct — uses the forked em
async save(book: Book): Promise<Book> {
  return this.repository.getEntityManager().transactional(async (em) => {
    const entity = await em.findOne(BookEntity, { id: book.id });
    if (!entity) throw new Error('Book not found');
    entity.title = book.title;
    await em.flush();
    return this.toDomain(entity);
  });
}

// ❌ Wrong — uses this.repository inside transactional (wrong identity map)
async save(book: Book): Promise<Book> {
  return this.repository.getEntityManager().transactional(async () => {
    const entity = await this.repository.findOne({ id: book.id }); // wrong context
    await this.repository.getEntityManager().flush();               // wrong context
  });
}
```

Without transactions: partial failures leave inconsistent state, connections
leak, concurrent operations see intermediate states, rollback is impossible.

## Repositories Return Domain Entities

Repositories accept and return domain entities, not ORM objects or raw rows.

```typescript
// ✅ Correct — returns domain entity
async create(book: Book): Promise<Book> {
  const entity = this.em.create(BookEntity, { ...book });
  await this.em.persist(entity).flush();
  return book;
}
```

The repository handles the mapping between domain entity and persistence model.
Callers never see database specifics (table names, column types, JOINs).

## MikroORM Entities

MikroORM entities live in `src/infrastructure/database/entities/` and use
`defineEntity` (MikroORM 7 — no decorators). They extend `BaseEntitySchema`,
which maps `id`, `createdAt`, `updatedAt` to columns.