import { ResourceNotFoundError } from '../ResourceNotFoundError';
import { UserId } from './UserId';

export class UserNotFoundError extends ResourceNotFoundError {
  constructor(readonly userId: UserId) {
    super('user', userId.value);
  }
}
