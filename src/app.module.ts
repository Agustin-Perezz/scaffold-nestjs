import { Module } from '@nestjs/common';

import { BooksModule } from './books.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, BooksModule],
})
export class AppModule {}
