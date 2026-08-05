import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BooksModule } from '../src/books.module';
import { AuthorEntitySchema } from '../src/infrastructure/database/postgres/entities/author.entity';
import { BookEntitySchema } from '../src/infrastructure/database/postgres/entities/book.entity';
import { AuthorFactory } from '../src/infrastructure/database/postgres/factories/author.factory';
import { BookFactory } from '../src/infrastructure/database/postgres/factories/book.factory';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Books Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let bookId: string;
  let authorId: string;

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(BooksModule, [BookEntitySchema, AuthorEntitySchema]));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await truncateAll(orm);

    const author = await new AuthorFactory(orm.em).createOne({ name: 'Andrew Hunt' });
    authorId = author.id;

    const book = await new BookFactory(orm.em).createOne({
      title: 'The Pragmatic Programmer',
      author: authorId,
      isbn: '978-0135957059',
      publicationYear: 1999,
      genre: 'Software Engineering',
    });

    bookId = book.id;
  });

  describe('/books (POST)', () => {
    it('should create a book correctly', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'The Pragmatic Programmer',
          authorId,
          isbn: '978-0201616224',
          publicationYear: 1999,
          genre: 'Software Engineering',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe('The Pragmatic Programmer');
          expect(response.body.authorId).toBe(authorId);
          expect(response.body.isbn).toBe('978-0201616224');
          expect(response.body.publicationYear).toBe(1999);
          expect(response.body.genre).toBe('Software Engineering');
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('should create a book without genre', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Clean Code',
          authorId,
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

    it('should return 400 with invalid publication year', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          authorId,
          isbn: '978-0201616224',
          publicationYear: 999,
        })
        .expect(400);
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          authorId,
        })
        .expect(400);
    });

    it('should return 404 when author does not exist', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          authorId: '00000000-0000-0000-0000-000000000000',
          isbn: '978-0201616224',
          publicationYear: 1999,
        })
        .expect(404);
    });
  });

  describe('/books (GET)', () => {
    it('should list books with pagination metadata', () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('books');
          expect(Array.isArray(response.body.books)).toBe(true);
          expect(response.body.books.length).toBeGreaterThan(0);
          expect(response.body).toHaveProperty('total');
          expect(response.body).toHaveProperty('limit');
          expect(response.body).toHaveProperty('offset');
          expect(typeof response.body.total).toBe('number');
          expect(response.body.limit).toBe(10);
          expect(response.body.offset).toBe(0);
        });
    });

    it('should respect limit and offset query params', async () => {
      await new BookFactory(orm.em).createOne({
        title: 'Second Book',
        author: authorId,
        isbn: '978-0000000002',
        publicationYear: 2001,
      });
      await new BookFactory(orm.em).createOne({
        title: 'Third Book',
        author: authorId,
        isbn: '978-0000000003',
        publicationYear: 2002,
      });

      return request(app.getHttpServer())
        .get('/books?limit=2&offset=1')
        .expect(200)
        .then((response) => {
          expect(response.body.books.length).toBe(2);
          expect(response.body.total).toBe(3);
          expect(response.body.limit).toBe(2);
          expect(response.body.offset).toBe(1);
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
          expect(response.body).toHaveProperty('authorId');
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
  });

  describe('/books/:id (PUT)', () => {
    it('should update a book correctly', () => {
      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          title: 'The Pragmatic Programmer: Your Journey to Mastery',
          publicationYear: 2020,
          genre: 'Software Development',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(bookId);
          expect(response.body.title).toBe('The Pragmatic Programmer: Your Journey to Mastery');
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

    it('should update authorId to another existing author', async () => {
      const otherAuthor = await new AuthorFactory(orm.em).createOne({ name: 'David Thomas' });

      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({ authorId: otherAuthor.id })
        .expect(200)
        .then((response) => {
          expect(response.body.authorId).toBe(otherAuthor.id);
        });
    });

    it('should return 404 when updating authorId to non-existent author', () => {
      return request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({ authorId: '00000000-0000-0000-0000-000000000000' })
        .expect(404);
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
      return request(app.getHttpServer()).delete(`/books/${bookId}`).expect(204);
    });

    it('should return 404 when deleting non-existent book', () => {
      return request(app.getHttpServer())
        .delete('/books/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 404 when trying to get deleted book', async () => {
      await request(app.getHttpServer()).delete(`/books/${bookId}`).expect(204);

      return request(app.getHttpServer()).get(`/books/${bookId}`).expect(404);
    });
  });

  describe('Complete workflow', () => {
    it('should create, read, update and delete a book', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Design Patterns',
          authorId,
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

      expect(getResponse.body.authorId).toBe(authorId);

      const updateResponse = await request(app.getHttpServer())
        .put(`/books/${createdBookId}`)
        .send({
          title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
          publicationYear: 1995,
        })
        .expect(200);

      expect(updateResponse.body.title).toBe(
        'Design Patterns: Elements of Reusable Object-Oriented Software',
      );

      await request(app.getHttpServer()).delete(`/books/${createdBookId}`).expect(204);

      await request(app.getHttpServer()).get(`/books/${createdBookId}`).expect(404);
    });
  });
});
