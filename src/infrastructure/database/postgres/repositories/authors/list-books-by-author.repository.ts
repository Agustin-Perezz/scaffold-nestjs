import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../../../application/shared/dtos/pagination.request.dto';
import { IListBooksByAuthorRepository } from '../../../../../application/use-cases/authors/list-books-by-author/list-books-by-author.repository.interface';
import { Author } from '../../../../../domain/entities/author.entity';
import { Book } from '../../../../../domain/entities/book.entity';
import { AuthorEntity } from '../../entities/author.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class ListBooksByAuthorRepository implements IListBooksByAuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: EntityRepository<AuthorEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: EntityRepository<BookEntity>,
  ) {}

  async findAuthorById(id: string): Promise<Author | null> {
    const entity = await this.authorRepository.findOne({ id });
    if (!entity) {
      return null;
    }
    return Author.reconstruct({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findBooksByAuthorId(
    authorId: string,
    pagination: PaginationRequestDto,
  ): Promise<[Book[], number]> {
    const { limit, offset } = pagination;

    const [entities, total] = await this.bookRepository.findAndCount(
      { author: authorId },
      { limit, offset, populate: ['author'] },
    );
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
