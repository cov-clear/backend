import { v4 } from 'uuid';

export class TestId {
  constructor(readonly value: string = v4()) {}
}
