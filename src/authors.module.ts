import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateAuthorUseCase } from './application/use-cases/authors/create-author/create-author.use-case';
import { ListBooksByAuthorUseCase } from './application/use-cases/authors/list-books-by-author/list-books-by-author.use-case';
import { AuthorEntitySchema } from './infrastructure/database/postgres/entities/author.entity';
import { BookEntitySchema } from './infrastructure/database/postgres/entities/book.entity';
import { CreateAuthorRepository } from './infrastructure/database/postgres/repositories/authors/create-author.repository';
import { ListBooksByAuthorRepository } from './infrastructure/database/postgres/repositories/authors/list-books-by-author.repository';
import { AuthorsController } from './presentation/controllers/authors/authors.controller';

@Module({
  controllers: [AuthorsController],
  providers: [
    {
      provide: 'ICreateAuthorRepository',
      useClass: CreateAuthorRepository,
    },
    {
      provide: 'IListBooksByAuthorRepository',
      useClass: ListBooksByAuthorRepository,
    },
    CreateAuthorUseCase,
    ListBooksByAuthorUseCase,
  ],
  imports: [MikroOrmModule.forFeature([AuthorEntitySchema, BookEntitySchema])],
})
export class AuthorsModule {}
