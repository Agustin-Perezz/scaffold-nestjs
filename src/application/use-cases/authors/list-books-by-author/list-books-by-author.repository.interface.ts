import { Author } from '../../../../domain/entities/author.entity';
import { Book } from '../../../../domain/entities/book.entity';

export interface IListBooksByAuthorRepository {
  findAuthorById(id: string): Promise<Author | null>;
  findBooksByAuthorId(authorId: string): Promise<Book[]>;
}
