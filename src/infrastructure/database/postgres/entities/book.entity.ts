import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

const BookEntitySchema = defineEntity({
  name: 'BookEntity',
  tableName: 'books',
  extends: BaseEntity,
  properties: {
    title: p.string().index(),
    author: p.string(),
    isbn: p.string().unique(),
    publicationYear: p.integer(),
    genre: p.string().nullable(),
  },
});

export class BookEntity extends BookEntitySchema.class {
  genre: string | null = null;

  constructor(title: string, author: string, isbn: string, publicationYear: number) {
    super();
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationYear = publicationYear;
  }
}

BookEntitySchema.setClass(BookEntity);

export { BookEntitySchema };
