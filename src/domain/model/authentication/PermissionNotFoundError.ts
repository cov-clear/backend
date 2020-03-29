import { ResourceNotFoundError } from '../ResourceNotFoundError';

export class PermissionNotFoundError extends ResourceNotFoundError {
  constructor(roleName: string) {
    super('permission', roleName);
  }
}
