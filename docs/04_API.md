# API - REST Endpoints

## Base URL

```
http://localhost:3000
```

## Swagger

Interactive documentation available at:

```
http://localhost:3000/api
```

---

## Books Endpoints

### POST /books

Create a new book.

**Request Body**

```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "isbn": "978-0-13-468599-1",
  "publicationYear": 2017,
  "genre": "Software Engineering"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Book title |
| `author` | string | yes | Author name |
| `isbn` | string | yes | ISBN (must be unique) |
| `publicationYear` | integer | yes | Year (1000–9999) |
| `genre` | string | no | Genre |

**Response 201**

```json
{
  "id": "019612b8-d3c4-7e9a-a456-426614174000",
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "isbn": "978-0-13-468599-1",
  "publicationYear": 2017,
  "genre": "Software Engineering",
  "createdAt": "2026-04-14T10:00:00.000Z",
  "updatedAt": "2026-04-14T10:00:00.000Z"
}
```

**Error Responses**

| Status | Description |
|--------|-------------|
| 400 | Invalid data or duplicate ISBN |

---

### GET /books

List all books.

**Response 200**

```json
{
  "books": [
    {
      "id": "019612b8-d3c4-7e9a-a456-426614174000",
      "title": "Clean Architecture",
      "author": "Robert C. Martin",
      "isbn": "978-0-13-468599-1",
      "publicationYear": 2017,
      "genre": "Software Engineering",
      "createdAt": "2026-04-14T10:00:00.000Z",
      "updatedAt": "2026-04-14T10:00:00.000Z"
    }
  ]
}
```

---

### GET /books/:id

Get a book by ID.

**Path Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Book UUID |

**Response 200**

```json
{
  "id": "019612b8-d3c4-7e9a-a456-426614174000",
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "isbn": "978-0-13-468599-1",
  "publicationYear": 2017,
  "genre": "Software Engineering",
  "createdAt": "2026-04-14T10:00:00.000Z",
  "updatedAt": "2026-04-14T10:00:00.000Z"
}
```

**Error Responses**

| Status | Description |
|--------|-------------|
| 404 | Book not found |

---

### PUT /books/:id

Update a book. Only provided fields are updated.

**Path Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Book UUID |

**Request Body** (all fields optional)

```json
{
  "title": "Clean Architecture (Updated Edition)",
  "author": "Robert C. Martin",
  "publicationYear": 2018,
  "genre": "Software Architecture"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | New title |
| `author` | string | New author |
| `publicationYear` | integer | New year (1000–9999) |
| `genre` | string \| null | New genre (null to clear) |

**Note**: `isbn` cannot be updated.

**Response 200**

```json
{
  "id": "019612b8-d3c4-7e9a-a456-426614174000",
  "title": "Clean Architecture (Updated Edition)",
  "author": "Robert C. Martin",
  "isbn": "978-0-13-468599-1",
  "publicationYear": 2018,
  "genre": "Software Architecture",
  "createdAt": "2026-04-14T10:00:00.000Z",
  "updatedAt": "2026-04-14T11:00:00.000Z"
}
```

**Error Responses**

| Status | Description |
|--------|-------------|
| 400 | Invalid data |
| 404 | Book not found |

---

### DELETE /books/:id

Delete a book.

**Path Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | Book UUID |

**Response 204** — No content

**Error Responses**

| Status | Description |
|--------|-------------|
| 404 | Book not found |

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Successful operation |
| `201` | Created - Resource created |
| `204` | No Content - Successful deletion |
| `400` | Bad Request - Invalid data |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error |

