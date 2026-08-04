import { Module } from '@nestjs/common';

import { AuthorsModule } from './authors.module';
import { BooksModule } from './books.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, BooksModule, AuthorsModule],
})
export class AppModule {}
