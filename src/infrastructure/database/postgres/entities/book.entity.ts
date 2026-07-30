import { defineEntity, p } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

const BookEntitySchema = defineEntity({
  name: 'BookEntity',
  tableName: 'books',
  properties: {
    id: p.uuid().primary(),
    title: p.string().index(),
    author: p.string(),
    isbn: p.string().unique(),
    publicationYear: p.integer(),
    genre: p.string().nullable(),
    createdAt: p.datetime(),
    updatedAt: p.datetime().onUpdate(() => new Date()),
  },
});

export class BookEntity extends BookEntitySchema.class {
  id = uuidv7();
  genre: string | null = null;
  createdAt = new Date();
  updatedAt = new Date();

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
