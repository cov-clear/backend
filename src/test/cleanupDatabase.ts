import { migrateLatest, rollbackDatabase } from '../database';

export async function cleanupDatabase() {
  await rollbackDatabase();
  await migrateLatest();
}
