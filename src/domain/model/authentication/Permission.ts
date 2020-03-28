import { DomainValidationError } from '../DomainValidationError';

const PERMISSION_NAME_REG_EXP = /^[A-Z]+[A-Z_]*[A-Z]+$/;

export class Permission {
  constructor(
    readonly name: string,
    readonly creationTime: Date = new Date()
  ) {}
}

function validateName(name: String) {
  if (!name.match(PERMISSION_NAME_REG_EXP)) {
    throw new DomainValidationError(
      'roleName',
      'Role name can be comprised of only capital english letters and underscores(_)'
    );
  }
}
