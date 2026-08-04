import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';
import { BookEntitySchema } from './book.entity';

const AuthorEntitySchema = defineEntity({
  name: 'AuthorEntity',
  tableName: 'authors',
  extends: BaseEntity,
  properties: {
    // ponytail: no unique constraint; add existsByName if anti-duplicate is required
    name: p.string(),
    // One-to-many: load an author's books via populate('books')
    books: () => p.oneToMany(BookEntitySchema).mappedBy('author'),
  },
});

export class AuthorEntity extends AuthorEntitySchema.class {
  constructor(name: string) {
    super();
    this.name = name;
  }
}

AuthorEntitySchema.setClass(AuthorEntity);

export { AuthorEntitySchema };
