import { Book } from '../../../../domain/entities/book.entity';

export interface IListBooksRepository {
  findAll(): Promise<Book[]>;
}
