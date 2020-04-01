import AWS from 'aws-sdk';

import { AWSEmailNotifier } from './AWSEmailNotifier';
import { Email } from '../../domain/model/user/Email';

describe('AWSEmailNotifier', () => {
  it('sends calls the aws api with the right parameters', async () => {
    const sesClient = new AWS.SES({ apiVersion: '2010-12-01' });

    const sendMethodSpy = jest.spyOn(sesClient, 'sendEmail').mockImplementation(
      () =>
        ({
          promise: () => Promise.resolve(),
        } as any)
    );

    const emailNotifier = new AWSEmailNotifier(sesClient);

    const result = await emailNotifier.send(
      new Email('example@example.com'),
      new Email('example@example.com'),
      'A subject',
      'A body'
    );

    expect(sendMethodSpy).toBeCalledTimes(1);
    expect(result).toBe(true);
  });

  it('an error in aws makes the promise to fail', async () => {
    const sesClient = new AWS.SES({ apiVersion: '2010-12-01' });

    const sendMethodSpy = jest.spyOn(sesClient, 'sendEmail').mockImplementation(
      () =>
        ({
          promise: () => Promise.reject(),
        } as any)
    );

    const emailNotifier = new AWSEmailNotifier(sesClient);

    await expect(
      emailNotifier.send(new Email('example@example.com'), new Email('example@example.com'), 'A subject', 'A body')
    ).rejects;

    expect(sendMethodSpy).toBeCalledTimes(1);
  });
});
