import { ResourceNotFoundError } from '../ResourceNotFoundError';

export class RoleNotFoundError extends ResourceNotFoundError {
  constructor(roleName: string) {
    super('role', roleName);
  }
}
