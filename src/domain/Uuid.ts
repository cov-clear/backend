import { v4 } from 'uuid';

export class Uuid {
  constructor(readonly value: string = v4()) {}

  public equals(other: any): boolean {
    return other instanceof Uuid && other.value === this.value;
  }
}
