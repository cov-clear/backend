import request from 'supertest';
import expressApp from '../../loaders/express';

describe('auth endpoints', () => {
  const app = expressApp();

  describe('POST /auth/magic-links', () => {
    it('creates a new magic link', (done) => {
      request(app)
        .post('/api/v1/auth/magic-links')
        .send({ email: 'kostas@gmail.com' })
        .expect(200)
        .then((response) => {
          expect(response.body.code).toBeDefined();
          expect(response.body.creationTime).toBeDefined();
          expect(response.body.active).toBeDefined();
        })
        .then(done);
    });
  });
});
