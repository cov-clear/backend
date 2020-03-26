import { TestType } from './TestType';

export interface TestTypeRepository {
  save(testType: TestType): Promise<TestType>;
  findByTrusted(isTrusted: boolean): Promise<Array<TestType> | null>;
}
