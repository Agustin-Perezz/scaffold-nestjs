import { Book } from '../../../../domain/entities/book.entity';

export interface IDeleteBookRepository {
    findById(id: string): Promise<Book | null>;
    delete(id: string): Promise<void>;
}
