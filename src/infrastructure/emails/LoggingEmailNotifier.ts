import { Email } from '../../domain/model/user/Email';
import { EmailNotifier } from '../../domain/model/EmailNotifier';
import logger from '../../logger';

export class LoggingEmailNotifier implements EmailNotifier {
  async send(from: Email, to: Email, subject: string, body: string): Promise<boolean> {
    logger.info(`Email to "${to.value}" with the body: ${body}`);
    return true;
  }
}
