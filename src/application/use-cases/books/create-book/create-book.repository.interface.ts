import { Book } from '../../../../domain/entities/book.entity';

export interface ICreateBookRepository {
  create(book: Book): Promise<Book>;
  existsByIsbn(isbn: string): Promise<boolean>;
}
