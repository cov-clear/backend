import request from 'supertest';
import expressApp from '../../loaders/express';
import { createMagicLink } from '../../application/service/createNewMagicLink';
import { v4 } from 'uuid';

describe('auth endpoints', () => {
  const app = expressApp();

  describe('POST /auth/magic-links', () => {
    it('creates a new magic link', async () => {
      await request(app)
        .post('/api/v1/auth/magic-links')
        .send({ email: 'kostas@gmail.com' })
        .expect(200)
        .then((response) => {
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
          authCode: magicLink.code,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.token).toBeDefined();
        });
    });
  });
});
