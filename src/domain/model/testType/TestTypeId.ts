import { v4 } from 'uuid';

export class TestTypeId {
  constructor(readonly value: string = v4()) {}
}
