import knex from 'knex';

import { Email } from '../../domain/model/user/Email';
import { EmailNotifier } from '../../domain/model/EmailNotifier';
import { MagicLink } from '../../domain/model/magiclink/MagicLink';

import type { Mailgun } from 'mailgun-js';

export class MailGunEmailNotifier implements EmailNotifier {
  constructor(private mailGunClient: Mailgun) {}

  async send(
    from: Email,
    to: Email,
    subject: string,
    body: string
  ): Promise<boolean> {
    const data = {
      from: from.value,
      to: to.value,
      subject: subject,
      html: body,
    };

    return new Promise((resolve, reject) => {
      this.mailGunClient.messages().send(data, function (error, body) {
        if (error) {
          return reject(error);
        }

        return resolve(true);
      });
    });
  }
}
