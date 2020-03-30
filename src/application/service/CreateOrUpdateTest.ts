import { UserId } from '../../domain/model/user/UserId';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestRepository } from '../../domain/model/test/TestRepository';
import { getTestTypes } from './index';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { Test as ApiTest } from '../../api/interface/index';

export class CreateOrUpdateTest {
  constructor(private testRepository: TestRepository) {}

  public async execute(userId: string, payload: ApiTest): Promise<Test> {
    const { testTypeId, results } = payload;
    const checkTestType = await getTestTypes.byId(testTypeId);

    console.log(
      'in createOrUpdateTest - checkTestType' + JSON.stringify(checkTestType)
    );

    if (!checkTestType) {
      throw new TestTypeNotFoundError(testTypeId);
    }

    const test = new Test(
      new TestId(),
      new UserId(userId),
      new TestTypeId(testTypeId)
    );
    return this.testRepository.save(test);
  }
}

export class TestTypeNotFoundError extends Error {
  constructor(readonly testTypeId: string) {
    super();
  }
}
