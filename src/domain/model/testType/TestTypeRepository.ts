import { TestType } from './TestType';

export interface TestTypeRepository {
  save(testType: TestType): Promise<TestType>;
  findByPermissions(permissions: string[]): Promise<Array<TestType>>;
}

export class TestTypeNameAlreadyExists extends Error {
  constructor(testTypeName: string) {
    super(`Test type with name ${testTypeName} already exists`);
  }
}
