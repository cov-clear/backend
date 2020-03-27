import { v4 } from 'uuid';

export class Role {
  constructor(
    readonly id: RoleId,
    readonly name: string,
    readonly creationTime: Date
  ) {}
}

export class RoleId {
  constructor(readonly value: string = v4()) {}
}
