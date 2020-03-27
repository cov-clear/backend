import { Authentication } from './Authentication';
import { User } from '../user/User';

export interface AuthenticationRepository {
  getAuthentication(user: User): Promise<Authentication>;
}
