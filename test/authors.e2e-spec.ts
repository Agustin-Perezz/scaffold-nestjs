import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthorsModule } from '../src/authors.module';
import { AuthorEntitySchema } from '../src/infrastructure/database/postgres/entities/author.entity';
import { BookEntitySchema } from '../src/infrastructure/database/postgres/entities/book.entity';
import { AuthorFactory } from '../src/infrastructure/database/postgres/factories/author.factory';
import { BookFactory } from '../src/infrastructure/database/postgres/factories/book.factory';
import { createTestApp } from './helpers/app.helper';
import { truncateAll } from './helpers/database.helper';

describe('Authors Controller (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let authorId: string;

  beforeAll(async () => {
    ({ app, orm } = await createTestApp(AuthorsModule, [AuthorEntitySchema, BookEntitySchema]));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await truncateAll(orm);

    const author = await new AuthorFactory(orm.em).createOne({ name: 'Andrew Hunt' });
    authorId = author.id;
  });

  describe('/authors (POST)', () => {
    it('should create an author correctly', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({ name: 'Robert Martin' })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('Robert Martin');
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer()).post('/authors').send({}).expect(400);
    });
  });

  describe('/authors/:id/books (GET)', () => {
    it('should return author and their books', async () => {
      await new BookFactory(orm.em).createOne({
        title: 'The Pragmatic Programmer',
        author: authorId,
        isbn: '978-0135957059',
        publicationYear: 1999,
        genre: 'Software Engineering',
      });

      return request(app.getHttpServer())
        .get(`/authors/${authorId}/books`)
        .expect(200)
        .then((response) => {
          expect(response.body.author.id).toBe(authorId);
          expect(response.body.author.name).toBe('Andrew Hunt');
          expect(Array.isArray(response.body.books)).toBe(true);
          expect(response.body.books.length).toBe(1);
          expect(response.body.books[0].title).toBe('The Pragmatic Programmer');
          expect(response.body.books[0].authorId).toBe(authorId);
        });
    });

    it('should return empty books array for author with no books', () => {
      return request(app.getHttpServer())
        .get(`/authors/${authorId}/books`)
        .expect(200)
        .then((response) => {
          expect(response.body.author.id).toBe(authorId);
          expect(response.body.books).toEqual([]);
        });
    });

    it('should return 404 for non-existent author', () => {
      return request(app.getHttpServer())
        .get('/authors/00000000-0000-0000-0000-000000000000/books')
        .expect(404);
    });
  });
});
