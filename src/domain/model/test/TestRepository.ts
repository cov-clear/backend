import { Test } from './Test';
import { TestId } from './TestId';
import { UserId } from '../user/UserId';
import { TestTypeId } from './testType/TestTypeId';

export interface TestRepository {
  save(test: Test): Promise<Test>;

  findById(id: TestId): Promise<Test | null>;
  findByUserId(userId: UserId): Promise<Array<Test>>;
}

export class TestTypeMissingForTestError extends Error {
  constructor(readonly testId: string, readonly testTypeId: string) {
    super(`Unexpected error. Could not find testType for test.`);
  }
}
