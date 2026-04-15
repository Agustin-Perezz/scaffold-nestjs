import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateBookRepository } from '../../../../../application/use-cases/books/create-book/create-book.repository.interface';
import { Book } from '../../../../../domain/entities/book.entity';
import { BookEntity } from '../../entities/book.entity';

@Injectable()
export class CreateBookRepository implements ICreateBookRepository {
    constructor(
        @InjectRepository(BookEntity)
        private readonly repository: EntityRepository<BookEntity>,
    ) {}

    async create(book: Book): Promise<Book> {
        const entity = new BookEntity(book.title, book.author, book.isbn, book.publicationYear);
        entity.id = book.id;
        entity.genre = book.genre;
        entity.createdAt = book.createdAt;
        entity.updatedAt = book.updatedAt;

        await this.repository.getEntityManager().persist(entity).flush();
        return book;
    }

    async existsByIsbn(isbn: string): Promise<boolean> {
        const count = await this.repository.count({ isbn });
        return count > 0;
    }
}
