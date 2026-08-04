import { Author } from '../../../../domain/entities/author.entity';

export interface ICreateAuthorRepository {
  create(author: Author): Promise<Author>;
}
