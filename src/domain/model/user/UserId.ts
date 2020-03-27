import { v4 } from 'uuid';

export class UserId {
  constructor(readonly value: string = v4()) {}
}
