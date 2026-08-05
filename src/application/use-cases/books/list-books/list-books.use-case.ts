import { Inject, Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';
import { IListBooksRepository } from './list-books.repository.interface';
import { BookResponseDto, ListBooksResponseDto } from './list-books.response.dto';

@Injectable()
export class ListBooksUseCase {
  constructor(
    @Inject('IListBooksRepository')
    private readonly repository: IListBooksRepository,
  ) {}

  async execute(pagination: PaginationRequestDto): Promise<ListBooksResponseDto> {
    const { limit, offset } = pagination;
    const [books, total] = await this.repository.findAll(pagination);
    return new ListBooksResponseDto({
      books: books.map(
        (book) =>
          new BookResponseDto({
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
      total,
      limit,
      offset,
    });
  }
}
