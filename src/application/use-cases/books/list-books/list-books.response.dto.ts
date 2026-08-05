import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationResponseDto } from '../../../shared/dtos/pagination.response.dto';

export class BookResponseDto {
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

  @ApiPropertyOptional({ description: 'Genre of the book' })
  genre: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<BookResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListBooksResponseDto extends PaginationResponseDto {
  @ApiProperty({ type: [BookResponseDto], description: 'List of books' })
  books: BookResponseDto[];

  constructor(partial: Partial<ListBooksResponseDto>) {
    super(partial);
    this.books = partial.books ?? [];
  }
}
