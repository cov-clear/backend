import { Test } from '../../../domain/model/test/Test';
import { TestId } from '../../../domain/model/test/TestId';
import { TestRepository } from '../../../domain/model/test/TestRepository';
import { UserId } from '../../../domain/model/user/UserId';
import { TestNotFoundError } from '../../../domain/model/test/TestNotFoundError';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';

export class GetTests {
  constructor(private testRepository: TestRepository) {}

  async byUserId(userId: string): Promise<Array<Test>> {
    return this.testRepository.findByUserId(new UserId(userId));
  }

  async byId(id: string): Promise<Test> {
    const test = await this.testRepository.findById(new TestId(id));
    if (!test) {
      throw new TestNotFoundError(id);
    }
    return test;
  }

  async getAll(testTypeId: TestTypeId): Promise<Array<Test>> {
    return this.testRepository.getAll(testTypeId);
  }
}
