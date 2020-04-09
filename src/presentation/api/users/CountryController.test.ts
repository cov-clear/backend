import request from 'supertest';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';
import { getTokenForUser } from '../../../test/authentication';
import { userRepository } from '../../../infrastructure/persistence';
import { aNewUser } from '../../../test/domainFactories';
import { RootController } from '../RootController';

describe('GET /countries', () => {
  const app = new RootController().expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('gets a list of all the countries', async () => {
    const user = await userRepository.save(aNewUser());

    await request(app)
      .get(`/api/v1/countries`)
      .set({ Authorization: `Bearer ${await getTokenForUser(user)}` })
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
