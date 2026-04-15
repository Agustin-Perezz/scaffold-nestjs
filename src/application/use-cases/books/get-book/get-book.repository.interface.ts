import { Book } from '../../../../domain/entities/book.entity';

export interface IGetBookRepository {
    findById(id: string): Promise<Book | null>;
}
