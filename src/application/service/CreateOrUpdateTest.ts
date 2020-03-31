import { UserId } from '../../domain/model/user/UserId';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { Results } from '../../domain/model/test/Results';

import { TestRepository } from '../../domain/model/test/TestRepository';
import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';

import { getTestTypes } from './index';
import { TestCommand } from '../../api/interface/index';

import { testResultsFactory } from './index';

import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';

export class CreateOrUpdateTest {
  constructor(
    private testRepository: TestRepository,
    private testTypeRepository: TestTypeRepository
  ) {}

  public async execute(
    actorUserId: string,
    subjectUserId: string,
    testCommand: TestCommand
  ): Promise<Test> {
    const { testTypeId } = testCommand;

    if (!testTypeId) {
      throw new DomainValidationError(
        'test.testTypeId',
        'Tests require a test type'
      );
    }

    const testType = await this.testTypeRepository.findById(
      new TestTypeId(testTypeId)
    );

    if (!testType) {
      throw new ResourceNotFoundError('testTypeId', testTypeId);
    }

    const results =
      testCommand.results && testCommand.results.details
        ? testResultsFactory.create(
            actorUserId,
            testType,
            testCommand.results.details
          )
        : undefined;

    const test = new Test(
      new TestId(),
      new UserId(subjectUserId),
      new TestTypeId(testTypeId),
      results
    );

    return this.testRepository.save(test);
  }
}
