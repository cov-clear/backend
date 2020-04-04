import { TestType } from '../../../domain/model/test/testType/TestType';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { TestTypeRepository } from '../../../domain/model/test/testType/TestTypeRepository';

export class GetTestTypes {
  constructor(private testTypeRepository: TestTypeRepository) {}

  async forPermissions(permissions: string[]): Promise<Array<TestType>> {
    return this.testTypeRepository.findByPermissions(permissions);
  }

  async byId(testTypeId: string): Promise<TestType | null> {
    return this.testTypeRepository.findById(new TestTypeId(testTypeId));
  }
}
