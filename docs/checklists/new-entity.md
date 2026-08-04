# Checklist: New Entity

Add a new entity to an existing domain (e.g., add `Review` to the `books` domain).

## Domain Layer

- [ ] Create entity at `src/domain/entities/{entity}.entity.ts`
- [ ] Entity extends `BaseEntity`
- [ ] Private fields, no decorators, no ORM imports
- [ ] `static create(props)` — generates UUIDv7 + timestamps
- [ ] `static reconstruct(props)` — restores from persisted data
- [ ] Domain methods for state changes (call `touch()`)
- [ ] Getters for read-only properties, no setters
- [ ] Unit test at `src/domain/entities/{entity}.entity.spec.ts`

## Infrastructure Layer

- [ ] Create MikroORM entity at `src/infrastructure/database/entities/{entity}.entity.ts`
- [ ] Use `defineEntity` (MikroORM 7 — no decorators)
- [ ] Extends `BaseEntitySchema`
- [ ] Create factory at `src/infrastructure/database/factories/{entity}.factory.ts`
- [ ] Factory extends `Factory<T>` from `@mikro-orm/seeder`

## Module Registration

- [ ] Add `{Entity}Schema` to `MikroOrmModule.forFeature([...])` in the domain module
- [ ] Register any new repositories with their interface tokens

## Verification

- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm test` passes (unit — new entity spec)
- [ ] `pnpm test:e2e` passes (e2e — factory seeds correctly)