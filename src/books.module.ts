import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';

import { CreateBookUseCase } from './application/use-cases/books/create-book/create-book.use-case';
import { DeleteBookUseCase } from './application/use-cases/books/delete-book/delete-book.use-case';
import { GetBookUseCase } from './application/use-cases/books/get-book/get-book.use-case';
import { ListBooksUseCase } from './application/use-cases/books/list-books/list-books.use-case';
import { UpdateBookUseCase } from './application/use-cases/books/update-book/update-book.use-case';
import { BookEntity } from './infrastructure/database/postgres/entities/book.entity';
import { CreateBookRepository } from './infrastructure/database/postgres/repositories/books/create-book.repository';
import { DeleteBookRepository } from './infrastructure/database/postgres/repositories/books/delete-book.repository';
import { GetBookRepository } from './infrastructure/database/postgres/repositories/books/get-book.repository';
import { ListBooksRepository } from './infrastructure/database/postgres/repositories/books/list-books.repository';
import { UpdateBookRepository } from './infrastructure/database/postgres/repositories/books/update-book.repository';
import { BooksController } from './presentation/controllers/books/books.controller';

@Module({
  controllers: [BooksController],
  providers: [
    {
      provide: 'ICreateBookRepository',
      useClass: CreateBookRepository,
    },
    {
      provide: 'IGetBookRepository',
      useClass: GetBookRepository,
    },
    {
      provide: 'IListBooksRepository',
      useClass: ListBooksRepository,
    },
    {
      provide: 'IUpdateBookRepository',
      useClass: UpdateBookRepository,
    },
    {
      provide: 'IDeleteBookRepository',
      useClass: DeleteBookRepository,
    },
    CreateBookUseCase,
    GetBookUseCase,
    ListBooksUseCase,
    UpdateBookUseCase,
    DeleteBookUseCase,
  ],
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      clientUrl: `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'books'}`,
      entities: [BookEntity],
      allowGlobalContext: true,
    }),
    MikroOrmModule.forFeature([BookEntity]),
  ],
})
export class BooksModule {}
