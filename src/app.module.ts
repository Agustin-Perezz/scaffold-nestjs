import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';

import { AuthorsModule } from './authors.module';
import { BooksModule } from './books.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, BooksModule, AuthorsModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
