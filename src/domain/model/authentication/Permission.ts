import { v4 } from 'uuid';

export class Permission {
  constructor(
    readonly id: PermissionId,
    readonly name: string,
    readonly creationTime: Date
  ) {}
}

export class PermissionId {
  constructor(readonly value: string = v4()) {}
}
