import { Inject, Injectable } from '@nestjs/common';

import { IListBooksRepository } from './list-books.repository.interface';
import { BookResponseDto, ListBooksResponseDto } from './list-books.response.dto';

@Injectable()
export class ListBooksUseCase {
  constructor(
    @Inject('IListBooksRepository')
    private readonly repository: IListBooksRepository,
  ) {}

  async execute(): Promise<ListBooksResponseDto> {
    const books = await this.repository.findAll();
    return new ListBooksResponseDto({
      books: books.map(
        (book) =>
          new BookResponseDto({
            id: book.id,
            title: book.title,
            author: book.author,
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
