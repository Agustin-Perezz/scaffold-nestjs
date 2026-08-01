import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { BookEntity } from '../entities/book.entity';

/**
 * Factory for generating BookEntity instances in tests and seeders.
 * Override any field via makeOne({ ... }) or createOne({ ... }).
 *
 * makeOne/make → creates entity in memory (call em.flush() to persist)
 * createOne/create → creates and persists to the database
 */
export class BookFactory extends Factory<BookEntity> {
  model = BookEntity;

  definition(): Partial<BookEntity> {
    return {
      title: faker.book.title(),
      author: faker.person.fullName(),
      isbn: faker.commerce.isbn(),
      publicationYear: faker.number.int({ min: 1900, max: 2025 }),
      genre: faker.book.genre(),
    };
  }
}
