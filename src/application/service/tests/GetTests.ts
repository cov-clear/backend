import { Test } from '../../../domain/model/test/Test';
import { TestId } from '../../../domain/model/test/TestId';
import { TestRepository } from '../../../domain/model/test/TestRepository';
import { UserId } from '../../../domain/model/user/UserId';
import { TestNotFoundError } from '../../../domain/model/test/TestNotFoundError';

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
}
