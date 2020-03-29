import request from 'supertest';
import expressApp from '../../loaders/express';
import { v4 } from 'uuid';
import { createMagicLink } from '../../application/service';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';

describe('auth endpoints', () => {
  const app = expressApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /auth/magic-links', () => {
    it('creates a new magic link', async () => {
      await request(app)
        .post('/api/v1/auth/magic-links')
        .send({ email: 'kostas@gmail.com' })
        .expect(200)
        .expect((response) => {
          expect(response.body.code).toBeDefined();
          expect(response.body.creationTime).toBeDefined();
          expect(response.body.active).toBeDefined();
        });
    });
  });

  describe('POST /auth/login', () => {
    it('returns 403 if the code and email combination does not exist', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ method: 'magic-link', email: 'some@email.com', authCode: v4() })
        .expect(403);
    });

    it('exchanges an auth code for a signed JWT', async () => {
      const magicLink = await createMagicLink.execute(
        'kostas@transferwise.com'
      );

      await request(app)
        .post('/api/v1/auth/login')
        .send({
          method: 'magic-link',
          email: magicLink.email.value,
          authCode: magicLink.code.value,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.token).toBeDefined();
        });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
