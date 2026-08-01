import { MikroORM } from '@mikro-orm/core';

/**
 * Clears all rows from all tables managed by the ORM so each test
 * starts with a clean state. Call in beforeEach for per-test isolation.
 */
export async function truncateAll(orm: MikroORM): Promise<void> {
  await orm.schema.clear();
}
