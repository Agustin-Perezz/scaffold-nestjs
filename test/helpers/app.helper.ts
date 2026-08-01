import { EntitySchema, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SeedManager } from '@mikro-orm/seeder';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

/**
 * Creates a NestJS application backed by an in-memory SQLite database
 * for isolated e2e testing. Schema is refreshed (drop + recreate) once
 * in beforeAll; call truncateAll between tests for per-test isolation.
 *
 * @param featureModule — the NestJS module under test (e.g. BooksModule)
 * @param entities — the MikroORM entity schemas registered in that module
 */
export async function createTestApp(
  featureModule: Type,
  entities: EntitySchema[],
): Promise<{ app: INestApplication; orm: MikroORM }> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      MikroOrmModule.forRoot({
        driver: SqliteDriver,
        dbName: ':memory:',
        entities,
        allowGlobalContext: true,
        extensions: [SeedManager],
      }),
      featureModule,
    ],
  }).compile();

  const orm = moduleFixture.get<MikroORM>(MikroORM);
  await orm.schema.refresh();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.init();

  return { app, orm };
}
