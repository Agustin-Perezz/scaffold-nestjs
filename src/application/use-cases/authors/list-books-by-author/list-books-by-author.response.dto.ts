import { ApiProperty } from '@nestjs/swagger';

import { PaginationResponseDto } from '../../../shared/dtos/pagination.response.dto';

export class AuthorSummaryDto {
  @ApiProperty({ description: 'Author unique ID' })
  id: string;

  @ApiProperty({ description: 'Author name' })
  name: string;

  constructor(partial: Partial<AuthorSummaryDto>) {
    Object.assign(this, partial);
  }
}

export class BookByAuthorDto {
  @ApiProperty({ description: 'Book unique ID' })
  id: string;

  @ApiProperty({ description: 'Book title' })
  title: string;

  @ApiProperty({ description: 'Author ID' })
  authorId: string;

  @ApiProperty({ description: 'ISBN' })
  isbn: string;

  @ApiProperty({ description: 'Year of publication' })
  publicationYear: number;

  @ApiProperty({ description: 'Genre of the book', nullable: true })
  genre: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<BookByAuthorDto>) {
    Object.assign(this, partial);
  }
}

export class ListBooksByAuthorResponseDto extends PaginationResponseDto {
  @ApiProperty({ description: 'Author summary' })
  author?: AuthorSummaryDto;

  @ApiProperty({ type: [BookByAuthorDto], description: 'Books by the author' })
  books: BookByAuthorDto[];

  constructor(partial: Partial<ListBooksByAuthorResponseDto>) {
    super(partial);
    this.author = partial.author;
    this.books = partial.books ?? [];
  }
}
