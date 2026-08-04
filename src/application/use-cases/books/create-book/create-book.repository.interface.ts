import { Author } from '../../../../domain/entities/author.entity';
import { Book } from '../../../../domain/entities/book.entity';

export interface ICreateBookRepository {
  create(book: Book): Promise<Book>;
  existsByIsbn(isbn: string): Promise<boolean>;
  findAuthorById(id: string): Promise<Author | null>;
}
