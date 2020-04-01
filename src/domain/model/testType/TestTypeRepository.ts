import { TestType } from './TestType';
import { TestTypeId } from './TestTypeId';

export interface TestTypeRepository {
  save(testType: TestType): Promise<TestType>;

  findByPermissions(permissions: string[]): Promise<Array<TestType>>;
  findById(testTypeId: TestTypeId): Promise<TestType | null>;
}

export class TestTypeNameAlreadyExists extends Error {
  constructor(testTypeName: string) {
    super(`Test type with name ${testTypeName} already exists`);
  }
}
