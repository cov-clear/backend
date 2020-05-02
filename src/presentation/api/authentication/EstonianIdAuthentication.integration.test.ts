import nock from 'nock';
import request from 'supertest';
import { decode } from 'jsonwebtoken';

import { RootController } from '../RootController';
import database from '../../../database';

describe('Estonian id authentication flow', () => {
  it('creates a signed-in user with estonian id authentication details', async () => {
    nock('https://id-sandbox.dokobit.com')
      .post('/api/authentication/create', { return_url: /\/authenticate/i })
      .query({ access_token: 'dummy' })
      .reply(200, {
        session_token: 'some-session-token',
        url: 'example.com/dokobit-redirect',
      });

    nock('https://id-sandbox.dokobit.com')
      .get('/api/authentication/some-session-token/status')
      .query({ access_token: 'dummy' })
      .reply(200, {
        code: '123321',
        name: 'Viljur',
        surname: 'Ukrim',
        country_code: 'ee',
      });

    const app = new RootController().expressApp();

    // first the user creates a session on our site and gets redirected to return url, which is the provider's site
    await request(app)
      .post('/api/v1/auth/sessions')
      .expect(200)
      .expect((response) => {
        expect(response.body.redirectUrl).toBe('example.com/dokobit-redirect');
      });

    // when the user is redirected back to our site from the provider's, they get the session token passed through the url and exchange it for our token
    const sessionTokenFromRedirect = 'some-session-token';

    let token = '';
    await request(app)
      .post('/api/v1/auth/login')
      .send({ method: 'ESTONIAN_ID', authCode: sessionTokenFromRedirect })
      .expect(200)
      .expect((response) => {
        token = response.body.token;
        expect(token).toBeDefined();
      });

    // finally, the user starts using our app with their new user
    const userId = (decode(token) as { [key: string]: any }).userId;

    await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((response) => {
        const user = response.body;
        expect(user.authenticationDetails).toEqual({
          method: 'ESTONIAN_ID',
          identifier: '123321',
        });
      });
  });
});

afterAll(() => {
  return database.destroy();
});
