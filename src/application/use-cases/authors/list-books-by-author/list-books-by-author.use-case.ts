import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IListBooksByAuthorRepository } from './list-books-by-author.repository.interface';
import {
  AuthorSummaryDto,
  BookByAuthorDto,
  ListBooksByAuthorResponseDto,
} from './list-books-by-author.response.dto';

@Injectable()
export class ListBooksByAuthorUseCase {
  constructor(
    @Inject('IListBooksByAuthorRepository')
    private readonly repository: IListBooksByAuthorRepository,
  ) {}

  async execute(authorId: string): Promise<ListBooksByAuthorResponseDto> {
    const author = await this.repository.findAuthorById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const books = await this.repository.findBooksByAuthorId(authorId);

    return new ListBooksByAuthorResponseDto({
      author: new AuthorSummaryDto({ id: author.id, name: author.name }),
      books: books.map(
        (book) =>
          new BookByAuthorDto({
            id: book.id,
            title: book.title,
            authorId: book.authorId,
            isbn: book.isbn,
            publicationYear: book.publicationYear,
            genre: book.genre,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
          }),
      ),
    });
  }
}
