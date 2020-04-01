import AWS from 'aws-sdk';

import { Email } from '../../domain/model/user/Email';
import { EmailNotifier } from '../../domain/model/notifications/EmailNotifier';

export class AWSEmailNotifier implements EmailNotifier {
  constructor(private sesClient: AWS.SES) {}

  async send(from: Email, to: Email, subject: string, body: string): Promise<boolean> {
    var params = {
      Source: from.value,
      Destination: {
        ToAddresses: [to.value],
      },
      Message: {
        Body: {
          Html: {
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

    await this.sesClient.sendEmail(params).promise();
    return true;
  }
}
