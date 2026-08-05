import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../../../application/shared/dtos/pagination.request.dto';
import { IListBooksRepository } from '../../../../../application/use-cases/books/list-books/list-books.repository.interface';
import { Book } from '../../../../../domain/entities/book.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class ListBooksRepository implements IListBooksRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repository: EntityRepository<BookEntity>,
  ) {}

  async findAll(pagination: PaginationRequestDto): Promise<[Book[], number]> {
    const { limit, offset } = pagination;

    const [entities, total] = await this.repository.findAndCount({}, { limit, offset });
    return [entities.map((e) => this.toDomain(e)), total];
  }

  private toDomain(entity: BookEntity): Book {
    return Book.reconstruct({
      id: entity.id,
      title: entity.title,
      authorId: entity.author,
      isbn: entity.isbn,
      publicationYear: entity.publicationYear,
      genre: entity.genre,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
