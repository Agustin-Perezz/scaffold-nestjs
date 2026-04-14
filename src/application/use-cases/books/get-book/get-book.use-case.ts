import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGetBookRepository } from './get-book.repository.interface';
import { GetBookResponseDto } from './get-book.response.dto';

@Injectable()
export class GetBookUseCase {
  constructor(
    @Inject('IGetBookRepository')
    private readonly repository: IGetBookRepository,
  ) {}

  async execute(id: string): Promise<GetBookResponseDto> {
    const book = await this.repository.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return new GetBookResponseDto({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publicationYear: book.publicationYear,
      genre: book.genre,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    });
  }
}
