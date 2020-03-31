import { TestRepository } from '../../domain/model/test/TestRepository';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { UserId } from '../../domain/model/user/UserId';

export class GetTests {
  constructor(private testRepository: TestRepository) {}

  async byUserId(userId: string): Promise<Array<Test>> {
    return this.testRepository.findByUserId(new UserId(userId));
  }

  async byId(id: string): Promise<Test | null> {
    return this.testRepository.findById(new TestId(id));
  }
}
