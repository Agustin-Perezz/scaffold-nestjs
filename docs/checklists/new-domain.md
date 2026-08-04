# Checklist: New Domain

Add a new domain (e.g., `autos`, `clientes`, `reservas`).

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

## Application Layer

- [ ] Create use case folders at `src/application/use-cases/{domain}/`
- [ ] One folder per operation (create, get, list, update, delete)
- [ ] Each folder: use-case, request.dto, response.dto, repository.interface, README.md

## Presentation Layer

- [ ] Create controller at `src/presentation/controllers/{domain}/{domain}.controller.ts`
- [ ] Swagger decorators (`@ApiTags`, `@ApiOperation`)
- [ ] DTOs with `class-validator` decorators

## Module Registration

- [ ] Create `{domain}.module.ts` with `MikroOrmModule.forFeature([{Entity}Schema])`
- [ ] Register each repository implementation with its interface token
- [ ] Register use cases as providers
- [ ] Import domain module in `AppModule`

## Verification

- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (unit)
- [ ] `pnpm test:e2e` passes (e2e)