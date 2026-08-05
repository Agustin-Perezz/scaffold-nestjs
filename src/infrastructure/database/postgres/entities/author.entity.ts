import { defineEntity, p } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';
import { BookEntitySchema } from './book.entity';

const AuthorEntitySchema = defineEntity({
  name: 'AuthorEntity',
  tableName: 'authors',
  extends: BaseEntity,
  properties: {
    name: p.string(),
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
