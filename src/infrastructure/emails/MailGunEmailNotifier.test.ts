import mailgun from 'mailgun-js';
import type { Mailgun, Messages } from 'mailgun-js';

import { MailGunEmailNotifier } from './MailGunEmailNotifier';
import { Email } from '../../domain/model/user/Email';

describe('MailGunEmailNotifier', () => {
  it('sends calls the mailgun api with the right parameters', async () => {
    const mailGunClient = new mailgun({ apiKey: 'ak', domain: 'example.com' });

    const sendMethodSpy = jest
      .spyOn(mailGunClient, 'messages')
      .mockImplementation(() => ({
        send: jest.fn().mockImplementation((data, fn) => fn()),
      }));

    const mailGunEmailNotifier = new MailGunEmailNotifier(mailGunClient);

    const result = await mailGunEmailNotifier.send(
      new Email('example@example.com'),
      new Email('example@example.com'),
      'A subject',
      'A body'
    );

    expect(sendMethodSpy).toBeCalledTimes(1);
    expect(result).toBe(true);
  });

  it('an error in mailgun makes the promise to fail', async () => {
    const mailGunClient = new mailgun({ apiKey: 'ak', domain: 'example.com' });

    const sendMethodSpy = jest
      .spyOn(mailGunClient, 'messages')
      .mockImplementation(() => ({
        send: jest.fn().mockImplementation((data, fn) => fn('error')),
      }));

    const mailGunEmailNotifier = new MailGunEmailNotifier(mailGunClient);

    await expect(
      mailGunEmailNotifier.send(
        new Email('example@example.com'),
        new Email('example@example.com'),
        'A subject',
        'A body'
      )
    ).rejects.toEqual('error');

    expect(sendMethodSpy).toBeCalledTimes(1);
  });
});
