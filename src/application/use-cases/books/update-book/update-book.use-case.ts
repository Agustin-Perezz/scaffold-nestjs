import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IUpdateBookRepository } from './update-book.repository.interface';
import { UpdateBookRequestDto } from './update-book.request.dto';
import { UpdateBookResponseDto } from './update-book.response.dto';

@Injectable()
export class UpdateBookUseCase {
  constructor(
    @Inject('IUpdateBookRepository')
    private readonly repository: IUpdateBookRepository,
  ) {}

  async execute(id: string, dto: UpdateBookRequestDto): Promise<UpdateBookResponseDto> {
    const book = await this.repository.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (dto.title !== undefined) {
      book.updateTitle(dto.title);
    }
    if (dto.author !== undefined) {
      book.updateAuthor(dto.author);
    }
    if (dto.publicationYear !== undefined) {
      book.updatePublicationYear(dto.publicationYear);
    }
    if (dto.genre !== undefined) {
      book.updateGenre(dto.genre);
    }

    const updated = await this.repository.save(book);

    return new UpdateBookResponseDto({
      id: updated.id,
      title: updated.title,
      author: updated.author,
      isbn: updated.isbn,
      publicationYear: updated.publicationYear,
      genre: updated.genre,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
