import { ResourceNotFoundError } from '../ResourceNotFoundError';

export class PermissionNotFoundError extends ResourceNotFoundError {
  constructor(permissionName: string) {
    super('permission', permissionName);
  }
}
