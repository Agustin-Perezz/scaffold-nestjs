import { defineEntity } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

export class BookEntity {
  id: string = uuidv7();
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  genre: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(title: string, author: string, isbn: string, publicationYear: number) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationYear = publicationYear;
  }
}

export const BookEntitySchema = defineEntity({
  class: BookEntity,
  tableName: 'books',
  properties: (p) => ({
    id: p.uuid().primary(),
    title: p.string().index(),
    author: p.string(),
    isbn: p.string().unique(),
    publicationYear: p.integer(),
    genre: p.string().nullable(),
    createdAt: p.datetime(),
    updatedAt: p.datetime().onUpdate(() => new Date()),
  }),
});
