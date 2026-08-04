import { Author } from '../../../../domain/entities/author.entity';
import { Book } from '../../../../domain/entities/book.entity';

export interface IUpdateBookRepository {
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
  findAuthorById(id: string): Promise<Author | null>;
}
