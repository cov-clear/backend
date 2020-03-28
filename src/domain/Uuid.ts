import { v4 } from 'uuid';

export class Uuid {
  constructor(readonly value: string = v4()) {}
}
