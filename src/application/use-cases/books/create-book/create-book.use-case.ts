import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Book } from '../../../../domain/entities/book.entity';
import { ICreateBookRepository } from './create-book.repository.interface';
import { CreateBookRequestDto } from './create-book.request.dto';
import { CreateBookResponseDto } from './create-book.response.dto';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject('ICreateBookRepository')
    private readonly repository: ICreateBookRepository,
  ) {}

  async execute(dto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
    const author = await this.repository.findAuthorById(dto.authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const isbnExists = await this.repository.existsByIsbn(dto.isbn);
    if (isbnExists) {
      throw new BadRequestException('A book with that ISBN already exists');
    }

    const book = Book.create({
      title: dto.title,
      authorId: dto.authorId,
      isbn: dto.isbn,
      publicationYear: dto.publicationYear,
      genre: dto.genre,
    });

    const created = await this.repository.create(book);

    return new CreateBookResponseDto({
      id: created.id,
      title: created.title,
      authorId: created.authorId,
      isbn: created.isbn,
      publicationYear: created.publicationYear,
      genre: created.genre,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
