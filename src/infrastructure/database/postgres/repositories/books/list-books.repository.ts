import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IListBooksRepository } from '../../../../../application/use-cases/books/list-books/list-books.repository.interface';
import { Book } from '../../../../../domain/entities/book.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class ListBooksRepository implements IListBooksRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repository: EntityRepository<BookEntity>,
  ) {}

  async findAll(): Promise<Book[]> {
    const entities = await this.repository.findAll();
    return entities.map((e) => this.toDomain(e));
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
