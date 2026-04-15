import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IUpdateBookRepository } from '../../../../../application/use-cases/books/update-book/update-book.repository.interface';
import { Book } from '../../../../../domain/entities/book.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class UpdateBookRepository implements IUpdateBookRepository {
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

  async save(book: Book): Promise<Book> {
    const entity = await this.repository.findOne({ id: book.id });
    if (!entity) {
      throw new Error('Book not found');
    }
    entity.title = book.title;
    entity.author = book.author;
    entity.publicationYear = book.publicationYear;
    entity.genre = book.genre;
    entity.updatedAt = new Date();
    await this.repository.getEntityManager().flush();
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
