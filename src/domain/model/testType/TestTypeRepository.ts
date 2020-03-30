import { TestType } from './TestType';

export interface TestTypeRepository {
  save(testType: TestType): Promise<TestType>;
  findByPermissions(permissions: string[]): Promise<Array<TestType>>;
}
