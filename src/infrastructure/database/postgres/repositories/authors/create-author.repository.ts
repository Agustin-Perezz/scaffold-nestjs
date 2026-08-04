import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateAuthorRepository } from '../../../../../application/use-cases/authors/create-author/create-author.repository.interface';
import { Author } from '../../../../../domain/entities/author.entity';
import { AuthorEntity } from '../../entities/author.entity';

@Injectable()
export class CreateAuthorRepository implements ICreateAuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly repository: EntityRepository<AuthorEntity>,
  ) {}

  async create(author: Author): Promise<Author> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new AuthorEntity(author.name);
      entity.id = author.id;
      entity.createdAt = author.createdAt;
      entity.updatedAt = author.updatedAt;

      await em.persist(entity).flush();
      return author;
    });
  }
}
