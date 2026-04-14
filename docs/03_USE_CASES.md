# Use Cases - Books

## Use Case Catalog

| ID | Use Case | Method | Endpoint |
|----|----------|--------|----------|
| UC-BOO-001 | Create Book | POST | `/books` |
| UC-BOO-002 | Get Book | GET | `/books/:id` |
| UC-BOO-003 | List Books | GET | `/books` |
| UC-BOO-004 | Update Book | PUT | `/books/:id` |
| UC-BOO-005 | Delete Book | DELETE | `/books/:id` |

---

## UC-BOO-001: Create Book

**Summary**: Creates a new book after validating the ISBN is not already registered.

### Request DTO

```typescript
export class CreateBookRequestDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    isbn: string;

    @IsInt()
    @Min(1000)
    @Max(9999)
    publicationYear: number;

    @IsString()
    @IsOptional()
    genre?: string;
}
```

### Business Rules

- ISBN must be unique across all books
- `publicationYear` must be a 4-digit integer (1000–9999)
- `genre` is optional

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Duplicate ISBN | `BadRequestException` (400) |
| Invalid input | `BadRequestException` (400) |

---

## UC-BOO-002: Get Book

**Summary**: Retrieves a single book by its ID.

### Business Rules

- Returns 404 if the book does not exist

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Book not found | `NotFoundException` (404) |

---

## UC-BOO-003: List Books

**Summary**: Returns all books in the system.

### Response DTO

```typescript
export class ListBooksResponseDto {
    books: GetBookResponseDto[];
}
```

---

## UC-BOO-004: Update Book

**Summary**: Updates mutable fields of an existing book. Only provided fields are updated.

### Request DTO

```typescript
export class UpdateBookRequestDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsInt()
    @Min(1000)
    @Max(9999)
    @IsOptional()
    publicationYear?: number;

    @IsString()
    @IsOptional()
    genre?: string | null;
}
```

### Business Rules

- `isbn` cannot be updated (immutable)
- Only fields present in the request body are updated
- Returns 404 if the book does not exist

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Book not found | `NotFoundException` (404) |
| Invalid input | `BadRequestException` (400) |

---

## UC-BOO-005: Delete Book

**Summary**: Permanently removes a book from the system.

### Business Rules

- Returns 404 if the book does not exist
- Returns 204 No Content on success

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Book not found | `NotFoundException` (404) |
