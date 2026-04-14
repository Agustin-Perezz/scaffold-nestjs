import { Book } from '../../../../domain/entities/book.entity';

export interface IUpdateBookRepository {
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
}
