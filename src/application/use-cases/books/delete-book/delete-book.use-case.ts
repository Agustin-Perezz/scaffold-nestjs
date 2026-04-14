import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDeleteBookRepository } from './delete-book.repository.interface';

@Injectable()
export class DeleteBookUseCase {
  constructor(
    @Inject('IDeleteBookRepository')
    private readonly repository: IDeleteBookRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const book = await this.repository.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.repository.delete(id);
  }
}
