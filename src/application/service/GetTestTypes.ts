import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestType } from '../../domain/model/testType/TestType';

export class GetTestTypes {
  constructor(private testTypeRepository: TestTypeRepository) {}

  async forPermissions(permissions: string[]): Promise<Array<TestType>> {
    return this.testTypeRepository.findByPermissions(permissions);
  }
}
