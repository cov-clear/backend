import { AuthorizationChecker } from './AuthorizationChecker';
import { Action } from 'routing-controllers';
import { User } from '../../domain/model/user/User';

/**
 * Used to make @CurrentUser() decorators work in controllers
 *
 * Also {@see attachAuthenticationToRequest}
 */
export class CurrentUserChecker extends AuthorizationChecker {
  async getUser(action: Action): Promise<User> {
    return action.request.authentication?.user;
  }
}
