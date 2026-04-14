import { SqliteDriver } from '@mikro-orm/sqlite';

export const databaseConfig = {
  driver: SqliteDriver,
  dbName: ':memory:',
  entities: ['src/infrastructure/database/entities/**/*.entity.ts'],
  entitiesTs: ['src/infrastructure/database/entities/**/*.entity.ts'],
  allowGlobalContext: true,
};
