import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestType } from '../../domain/model/testType/TestType';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';

export class GetTestTypes {
  constructor(private testTypeRepository: TestTypeRepository) {}

  async byTrusted(trusted: boolean): Promise<Array<TestType>> {
    return this.testTypeRepository.findByTrusted(trusted);
  }

  async byId(testTypeId: string): Promise<TestType | null> {
    return this.testTypeRepository.findById(new TestTypeId(testTypeId));
  }
}
