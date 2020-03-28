import { Test } from './Test';
import { TestId } from './TestId';

export interface TestRepository {
  save(test: Test): Promise<Test>;

  findById(id: TestId): Promise<Test | null>;
}
