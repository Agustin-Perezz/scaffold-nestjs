import { MikroORM } from '@mikro-orm/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { BooksModule } from '../src/books.module';

describe('Books Controller (e2e)', () => {
  let app: INestApplication;
  let bookId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BooksModule],
    }).compile();

    const orm = moduleFixture.get(MikroORM);
    await orm.schema.refreshDatabase();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/books (POST)', () => {
    it('should create a book correctly', async () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'The Pragmatic Programmer',
          author: 'Andrew Hunt',
          isbn: '978-0135957059',
          publicationYear: 1999,
          genre: 'Software Engineering',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe('The Pragmatic Programmer');
          expect(response.body.author).toBe('Andrew Hunt');
          expect(response.body.isbn).toBe('978-0135957059');
          expect(response.body.publicationYear).toBe(1999);
          expect(response.body.genre).toBe('Software Engineering');
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
          bookId = response.body.id;
        });
    });

    it('should create a book without genre', async () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Clean Code',
          author: 'Robert Martin',
          isbn: '978-0132350884',
          publicationYear: 2008,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe('Clean Code');
          expect(response.body.genre).toBeNull();
        });
    });

    it('should return 400 with invalid data', async () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
          isbn: '978-invalid',
          publicationYear: 'invalid-year',
        })
        .expect(400);
    });

    it('should return 400 with invalid publication year', async () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
          isbn: '978-0135957059',
          publicationYear: 999,
        })
        .expect(400);
    });

    it('should return 400 when required fields are missing', async () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
        })
        .expect(400);
    });
  });

  describe('/books (GET)', () => {
    it('should list all books', () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('books');
          expect(Array.isArray(response.body.books)).toBe(true);
          expect(response.body.books.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/books/:id (GET)', () => {
    it('should get a book by ID', () => {
      return request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(bookId);
          expect(response.body).toHaveProperty('title');
          expect(response.body).toHaveProperty('author');
          expect(response.body).toHaveProperty('isbn');
          expect(response.body).toHaveProperty('publicationYear');
          expect(response.body).toHaveProperty('genre');
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 404 for non-existent book', () => {
      return request(app.getHttpServer())
        .get('/books/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 404 for invalid ID', () => {
      return request(app.getHttpServer())
        .get('/books/invalid-id')
        .expect(404);
    });
  });

  describe('/books/:id (PUT)', () => {
    it('should update a book correctly', () => {
      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          title: 'The Pragmatic Programmer: Your Journey to Mastery',
          author: 'Andrew Hunt and David Thomas',
          publicationYear: 2020,
          genre: 'Software Development',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(bookId);
          expect(response.body.title).toBe('The Pragmatic Programmer: Your Journey to Mastery');
          expect(response.body.author).toBe('Andrew Hunt and David Thomas');
          expect(response.body.publicationYear).toBe(2020);
          expect(response.body.genre).toBe('Software Development');
        });
    });

    it('should update only the title', () => {
      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          title: 'Updated Title',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(bookId);
          expect(response.body.title).toBe('Updated Title');
        });
    });

    it('should update genre to null', () => {
      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          genre: null,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.genre).toBeNull();
        });
    });

    it('should return 404 when updating non-existent book', () => {
      return request(app.getHttpServer())
        .put('/books/00000000-0000-0000-0000-000000000000')
        .send({
          title: 'Updated Title',
        })
        .expect(404);
    });

    it('should return 400 with invalid data', () => {
      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          publicationYear: 999,
        })
        .expect(400);
    });
  });

  describe('/books/:id (DELETE)', () => {
    it('should delete a book correctly', () => {
      return request(app.getHttpServer())
        .delete(`/books/${bookId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent book', () => {
      return request(app.getHttpServer())
        .delete('/books/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 404 when trying to get deleted book', () => {
      return request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(404);
    });
  });

  describe('Complete workflow', () => {
    it('should create, read, update and delete a book', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Design Patterns',
          author: 'Gang of Four',
          isbn: '978-0201633610',
          publicationYear: 1994,
          genre: 'Software Architecture',
        })
        .expect(201);

      const createdBookId = createResponse.body.id;
      expect(createResponse.body.title).toBe('Design Patterns');

      const getResponse = await request(app.getHttpServer())
        .get(`/books/${createdBookId}`)
        .expect(200);

      expect(getResponse.body.author).toBe('Gang of Four');

      const updateResponse = await request(app.getHttpServer())
        .put(`/books/${createdBookId}`)
        .send({
          title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
          publicationYear: 1995,
        })
        .expect(200);

      expect(updateResponse.body.title).toBe('Design Patterns: Elements of Reusable Object-Oriented Software');

      await request(app.getHttpServer())
        .delete(`/books/${createdBookId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/books/${createdBookId}`)
        .expect(404);
    });
  });
});
