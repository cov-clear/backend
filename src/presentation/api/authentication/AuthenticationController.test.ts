import nock from 'nock';
import request from 'supertest';
import { v4 } from 'uuid';
import { createMagicLink } from '../../../application/service';
import database from '../../../database';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import { MagicLinkAuthenticationErrorReason } from '../../../application/service/authentication/MagicLinkAuthenticator';
import { RootController } from '../RootController';

describe('auth endpoints', () => {
  const app = new RootController().expressApp();

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
          expect(response.body.expirationTime).toBeDefined();
          expect(response.body.active).toBeDefined();
        });
    });

    it('returns proper error code if email is not a valid email', async () => {
      await request(app)
        .post('/api/v1/auth/magic-links')
        .send({ email: '.213@invalid.com' })
        .expect(422)
        .expect((response) => {
          expect(response.body.code).toBeDefined();
        });
    });

    describe('for production', () => {
      let originalEnv: any;

      beforeEach(async () => {
        originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
      });

      afterEach(() => {
        process.env.NODE_ENV = originalEnv;
      });

      it('does not send the code back in the response', async () => {
        await request(app)
          .post('/api/v1/auth/magic-links')
          .send({ email: 'kostas@gmail.com' })
          .expect(200)
          .expect((response) => {
            expect(response.body.code).not.toBeDefined();
          });
      });
    });
  });

  describe('POST /auth/sessions', () => {
    it('creates a Dokobit session', async () => {
      nock('https://id-sandbox.dokobit.com')
        .post('/api/authentication/create', { return_url: /\/authentication-callback/i })
        .query({ access_token: 'dummy' })
        .reply(200, { session_token: 'some session token', url: 'example.com/dokobit-redirect' });

      await request(app)
        .post('/api/v1/auth/sessions')
        .expect(200)
        .expect((response) => {
          expect(response.body.redirectUrl).toBe('example.com/dokobit-redirect');
        });
    });
  });

  describe('POST /auth/login', () => {
    describe('with magic link', () => {
      it('returns 422 if the code does not exist', async () => {
        await request(app)
          .post('/api/v1/auth/login')
          .send({ method: 'MAGIC_LINK', authCode: v4() })
          .expect(422)
          .expect((res) => {
            expect(res.body.code).toEqual(MagicLinkAuthenticationErrorReason.AUTH_CODE_NOT_FOUND);
          });
      });

      it('exchanges an auth code for a signed JWT', async () => {
        const magicLink = await createMagicLink.execute('kostas@example.com');

        await request(app)
          .post('/api/v1/auth/login')
          .send({
            method: 'MAGIC_LINK',
            authCode: magicLink.code.value,
          })
          .expect(200)
          .expect((response) => {
            expect(response.body.token).toBeDefined();
          });
      });
    });

    describe('with estonian id', () => {
      it('returns 422 if the estonian id session is invalid', async () => {
        nock('https://id-sandbox.dokobit.com')
          .get('/api/authentication/some-session-token/status')
          .query({ access_token: 'dummy' })
          .reply(403, { message: 'we failed' });

        await request(app)
          .post('/api/v1/auth/login')
          .send({ method: 'ESTONIAN_ID', authCode: 'some-session-token' })
          .expect(422)
          .expect((res) => {
            expect(res.body.code).toBe('ID_AUTH_INVALID');
          });
      });

      it('exchanges an auth code for a signed JWT', async () => {
        nock('https://id-sandbox.dokobit.com')
          .get('/api/authentication/some-session-token/status')
          .query({ access_token: 'dummy' })
          .reply(200, {
            code: '39210030814',
            name: 'Viljur',
            surname: 'Ukrim',
            country_code: 'ee',
          });

        await request(app)
          .post('/api/v1/auth/login')
          .send({ method: 'ESTONIAN_ID', authCode: 'some-session-token' })
          .expect(200)
          .expect((response) => {
            expect(response.body.token).toBeDefined();
          });
      });
    });
  });
});

afterAll(() => {
  return database.destroy();
});
