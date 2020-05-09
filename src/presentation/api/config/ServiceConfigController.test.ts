import request from 'supertest';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';
import { RootController } from '../RootController';

describe('service config endpoints', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('GET /config', () => {
    it('successfully gets the config', async () => {
      await request(app)
        .get(`/api/v1/config`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body.preferredAuthMethod).toBe('MAGIC_LINK');
          expect(res.body.defaultLanguage).toBe('en');
          expect(res.body.addressRequired).toBe(true);
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
