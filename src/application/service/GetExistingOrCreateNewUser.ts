import { User } from '../../domain/model/user/User';
import { v4 } from 'uuid';
import { Email } from '../../domain/model/user/Email';

export class GetExistingOrCreateNewUser {
  public async execute(email: string) {
    return new User(v4(), new Email(email));
  }
}
