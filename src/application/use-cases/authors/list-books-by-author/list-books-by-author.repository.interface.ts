import { Author } from '../../../../domain/entities/author.entity';
import { Book } from '../../../../domain/entities/book.entity';
import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';

export interface IListBooksByAuthorRepository {
  findAuthorById(id: string): Promise<Author | null>;
  findBooksByAuthorId(
    authorId: string,
    pagination: PaginationRequestDto,
  ): Promise<[Book[], number]>;
}
