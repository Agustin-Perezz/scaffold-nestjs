# Domain Rules

Rules for `src/domain/entities/`. Loaded via `opencode.json`.

## Pure Domain

Domain entities MUST be pure TypeScript. No framework decorators, no ORM
imports, no infrastructure dependencies.

```typescript
// ✅ Correct — pure domain entity
export class Book extends BaseEntity {
  private _title: string;

  static create(props: CreateBookProps): Book {
    return new Book({ ...generateBaseEntityProps(), title: props.title });
  }

  get title(): string { return this._title; }
}

// ❌ Wrong — domain entity with decorators
import { Property } from '@mikro-orm/core'; // no ORM imports in domain
```

MikroORM 7 removed decorators entirely — use `defineEntity` in the
infrastructure layer (`src/infrastructure/database/entities/`), not in domain.

## Factory Methods

Always use factory methods (`create`, `reconstruct`), never `new` outside the
class. Constructors are private.

```typescript
// ✅ Correct
const book = Book.create({ title: '...', author: '...' });

// ❌ Wrong — constructor is private
const book = new Book(...);
```

`create` generates UUIDv7 + timestamps. `reconstruct` restores from persisted
data (takes `id`, `createdAt`, `updatedAt`).

## Behavior Through Methods

State changes happen through domain methods, not property assignment.

```typescript
// ✅ Correct — business intent is clear
book.updateTitle('New Title');

// ❌ Wrong — no invariant checking, no domain language
book.title = 'New Title';
```

Methods validate before changing state and bump `updatedAt` via `touch()`.

## Getters, No Setters

Expose read-only properties via getters. No public setters.

```typescript
get id(): string { return this._id; }
get title(): string { return this._title; }
```

## BaseEntity Contract

Every domain entity extends `BaseEntity` (`src/domain/entities/base.entity.ts`):
- `id: string` — UUIDv7, generated in `generateBaseEntityProps()`
- `createdAt: Date` — immutable
- `updatedAt: Date` — advanced by `protected touch()`

No `deletedAt` — soft delete is a per-aggregate decision, not cross-cutting.

## Direct Imports

No barrel files. Import entities directly.

```typescript
// ✅ Correct
import { Book } from '../../../../domain/entities/book.entity';

// ❌ Wrong — barrel file
import { Entities } from '../../domain';
```