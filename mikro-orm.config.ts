import 'dotenv/config';

import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';

import { AuthorEntitySchema } from './src/infrastructure/database/postgres/entities/author.entity';
import { BookEntitySchema } from './src/infrastructure/database/postgres/entities/book.entity';

export const ormConfig = defineConfig({
  clientUrl: `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'books'}`,
  entities: [AuthorEntitySchema, BookEntitySchema],
  allowGlobalContext: true,
  extensions: [SeedManager, Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts,cjs}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    emit: 'ts',
  },
});

export default ormConfig;
