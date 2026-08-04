import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateBookRepository } from '../../../../../application/use-cases/books/create-book/create-book.repository.interface';
import { Author } from '../../../../../domain/entities/author.entity';
import { Book } from '../../../../../domain/entities/book.entity';
import { AuthorEntity } from '../../entities/author.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class CreateBookRepository implements ICreateBookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repository: EntityRepository<BookEntity>,
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: EntityRepository<AuthorEntity>,
  ) {}

  async create(book: Book): Promise<Book> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new BookEntity(book.title, book.authorId, book.isbn, book.publicationYear);
      entity.id = book.id;
      entity.genre = book.genre;
      entity.createdAt = book.createdAt;
      entity.updatedAt = book.updatedAt;

      await em.persist(entity).flush();
      return book;
    });
  }

  async existsByIsbn(isbn: string): Promise<boolean> {
    const count = await this.repository.count({ isbn });
    return count > 0;
  }

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
}
