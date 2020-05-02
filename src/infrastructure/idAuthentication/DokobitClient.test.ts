import nock from 'nock';

import { DokobitClient } from './DokobitClient';

describe('Dokobit client', () => {
  it('creates sessions with auth params', async () => {
    nock('https://id-sandbox.dokobit.com')
      .post('/api/authentication/create', { return_url: 'example.com/authenticate' })
      .query({ access_token: 'dummy' })
      .reply(200, { session_token: 'some session token', url: 'example.com/dokobit-redirect' });

    const client = new DokobitClient();

    const result = await client.createSession({ returnUrl: 'example.com/authenticate' });

    expect(result.url).toBe('example.com/dokobit-redirect');
    expect(result.sessionToken).toBe('some session token');
  });

  it('gets session status with auth params', async () => {
    nock('https://id-sandbox.dokobit.com')
      .get('/api/authentication/seshToken/status')
      .query({ access_token: 'dummy' })
      .reply(200, { code: '123', name: 'Indrek', surname: 'Nolan', country_code: 'ee' });

    const client = new DokobitClient();

    const result = await client.getSessionStatus('seshToken');

    expect(result.code).toBe('123');
    expect(result.name).toBe('Indrek');
    expect(result.surname).toBe('Nolan');
    expect(result.countryCode).toBe('ee');
  });
});
