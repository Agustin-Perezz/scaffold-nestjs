# Checklist: New Use Case

Add a new use case to an existing domain (e.g., `search-books`, `archive-book`).

## Application Layer

- [ ] Create folder at `src/application/use-cases/{domain}/{action}-{entity}/`
- [ ] Create `{action}-{entity}.use-case.ts`
- [ ] Create `{action}-{entity}.request.dto.ts` with `class-validator` decorators
- [ ] Create `{action}-{entity}.response.dto.ts`
- [ ] Create `{action}-{entity}.repository.interface.ts` — one interface per operation
- [ ] Create `README.md` with use case documentation

## Use Case Implementation

- [ ] `@Injectable()` decorator
- [ ] Inject repository via `@Inject('I{Action}{Entity}Repository')`
- [ ] `execute(dto)` method returns response DTO
- [ ] Use case does NOT call other use cases
- [ ] Shared logic extracted to domain, not to another use case

## Infrastructure Layer

- [ ] Create repository at `src/infrastructure/database/repositories/{domain}/{action}-{entity}.repository.ts`
- [ ] Implements the use case's repository interface
- [ ] All DB operations wrapped in `this.orm.em.transactional()`
- [ ] Returns domain entities, not ORM objects

## Presentation Layer

- [ ] Add endpoint to controller at `src/presentation/controllers/{domain}/{domain}.controller.ts`
- [ ] Swagger decorators (`@ApiOperation`, `@ApiResponse`)
- [ ] Route handler calls use case `execute()`

## Module Registration

- [ ] Register repository: `{ provide: 'I{Action}{Entity}Repository', useClass: {Action}{Entity}Repository }`
- [ ] Register use case as provider

## Verification

- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test:e2e` passes (new endpoint covered)