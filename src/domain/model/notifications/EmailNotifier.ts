import { Email } from '../user/Email';

export interface EmailNotifier {
  send(from: Email, to: Email, subject: string, body: string): Promise<boolean>;
}
