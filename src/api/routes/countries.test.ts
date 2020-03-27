import request from 'supertest';
import expressApp from '../../loaders/express';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import database from '../../database';

describe('GET /countries', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('gets a list of all the countries', async () => {
    await request(app)
      .get(`/api/v1/countries`)
      .expect(200)
      .expect((res) => {
        const countries = res.body as Array<{ code: string; name: string }>;
        expect(countries).toBeDefined();
        expect(countries.length > 0).toBe(true);
      });
  });
});

afterAll(() => {
  return database.destroy();
});
