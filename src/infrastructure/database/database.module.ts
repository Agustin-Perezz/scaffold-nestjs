import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { Module } from '@nestjs/common';

import { AuthorEntitySchema } from './postgres/entities/author.entity';
import { BookEntitySchema } from './postgres/entities/book.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      clientUrl: `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'books'}`,
      entities: [AuthorEntitySchema, BookEntitySchema],
      allowGlobalContext: true,
      extensions: [SeedManager],
    }),
  ],
})
export class DatabaseModule {}
