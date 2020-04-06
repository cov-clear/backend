import { TestType } from './TestType';
import { TestTypeId } from './TestTypeId';
import { ResourceNotFoundError } from '../../ResourceNotFoundError';

export interface TestTypeRepository {
  save(testType: TestType): Promise<TestType>;

  findByPermissions(permissions: string[]): Promise<Array<TestType>>;
  findById(testTypeId: TestTypeId): Promise<TestType | null>;
  findAll(): Promise<Array<TestType>>;
}

export class TestTypeNameAlreadyExists extends Error {
  constructor(testTypeName: string) {
    super(`Test type with name ${testTypeName} already exists`);
  }
}

export class TestTypeNotFoundError extends ResourceNotFoundError {
  constructor(id: string) {
    super('testType', id);
  }
}
