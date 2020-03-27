import { TestTypeId } from './TestTypeId';

export class TestType {
  constructor(
    readonly id: TestTypeId,
    readonly name: string,
    readonly resultsSchema: object,
    readonly requireTrusted: boolean
  ) {}
}
