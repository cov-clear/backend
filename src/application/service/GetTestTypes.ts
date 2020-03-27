import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestType } from '../../domain/model/testType/TestType';

export class GetTestTypes {
  constructor(private testTypeRepository: TestTypeRepository) {}

  async byTrusted(trusted: boolean): Promise<Array<TestType> | null> {
    return this.testTypeRepository.findByTrusted(trusted);
  }
}
