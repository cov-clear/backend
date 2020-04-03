import request from 'supertest';
import { v4 } from 'uuid';
import { createMagicLink } from '../../application/service';
import database from '../../database';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { AuthorisationFailureReason } from '../../application/service/authentication/ExchangeAuthCode';
import { Container } from 'typedi';
import { Application } from '../../presentation/Application';

describe('auth endpoints', () => {
  const app = Container.get(Application).getExpressApp();

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
    it('returns 403 if the code does not exist', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ method: 'magic-link', email: 'some@email.com', authCode: v4() })
        .expect(403)
        .expect((res) => {
          expect(res.body.code).toEqual(AuthorisationFailureReason.AUTH_CODE_NOT_FOUND);
        });
    });

    it('exchanges an auth code for a signed JWT', async () => {
      const magicLink = await createMagicLink.execute('kostas@example.com');

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
