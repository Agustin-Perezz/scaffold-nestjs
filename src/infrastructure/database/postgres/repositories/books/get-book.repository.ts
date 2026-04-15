import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IGetBookRepository } from '../../../../../application/use-cases/books/get-book/get-book.repository.interface';
import { Book } from '../../../../../domain/entities/book.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class GetBookRepository implements IGetBookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repository: EntityRepository<BookEntity>,
  ) {}

  async findById(id: string): Promise<Book | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  private toDomain(entity: BookEntity): Book {
    return Book.reconstruct({
      id: entity.id,
      title: entity.title,
      author: entity.author,
      isbn: entity.isbn,
      publicationYear: entity.publicationYear,
      genre: entity.genre,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
