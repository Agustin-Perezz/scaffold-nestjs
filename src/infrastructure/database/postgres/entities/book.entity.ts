import { defineEntity, p } from '@mikro-orm/core';

import { AuthorEntitySchema } from './author.entity';
import { BaseEntity } from './base.entity';

const BookEntitySchema = defineEntity({
  name: 'BookEntity',
  tableName: 'books',
  extends: BaseEntity,
  properties: {
    title: p.string().index(),
    author: () => p.manyToOne(AuthorEntitySchema).mapToPk(),
    isbn: p.string().unique(),
    publicationYear: p.integer(),
    genre: p.string().nullable(),
  },
});

export class BookEntity extends BookEntitySchema.class {
  genre: string | null = null;

  constructor(title: string, authorId: string, isbn: string, publicationYear: number) {
    super();
    this.title = title;
    this.author = authorId;
    this.isbn = isbn;
    this.publicationYear = publicationYear;
  }
}

BookEntitySchema.setClass(BookEntity);

export { BookEntitySchema };
