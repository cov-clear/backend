import { User } from '../domain/model/user/User';
import { generateAuthToken } from '../application/service';

export async function getTokenForUser(user: User) {
  return generateAuthToken.execute(user);
}
