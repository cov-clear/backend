import { migrateLatest } from '../database';

export async function migrateDatabase() {
  await migrateLatest();
}
