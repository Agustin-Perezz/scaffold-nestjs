import { Book } from '../../../../domain/entities/book.entity';
import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';

export interface IListBooksRepository {
  findAll(pagination: PaginationRequestDto): Promise<[Book[], number]>;
}
