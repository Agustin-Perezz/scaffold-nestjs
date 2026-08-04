import { faker } from '@faker-js/faker';
import { Factory } from '@mikro-orm/seeder';

import { AuthorEntity } from '../entities/author.entity';

export class AuthorFactory extends Factory<AuthorEntity> {
  model = AuthorEntity;

  definition(): Partial<AuthorEntity> {
    return {
      name: faker.person.fullName(),
    };
  }
}
