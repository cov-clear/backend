import { UserId } from '../../domain/model/user/UserId';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { TestRepository } from '../../domain/model/test/TestRepository';
import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestResultsCommand } from '../../api/interface';
import { testResultsFactory } from './index';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';
import { TestType } from '../../domain/model/testType/TestType';
import { User } from '../../domain/model/user/User';
import { AccessDeniedError } from '../../domain/model/AccessDeniedError';
import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { TestNotFoundError } from '../../domain/model/test/TestNotFoundError';

export class AddResultsToTest {
  constructor(private testRepository: TestRepository, private testTypeRepository: TestTypeRepository) {}

  public async execute(actor: User, testId: string, resultsCommand: TestResultsCommand): Promise<Test> {
    const test = await this.getTestOrFail(testId);
    const testType = await this.getTestTypeOrFail(test.testTypeId);

    await this.validateAccessAndPermissionToAddResults(actor, testType);

    test.results = this.getResults(actor.id, testType, resultsCommand);
    return this.testRepository.save(test);
  }

  private async getTestOrFail(testId: string) {
    const test = await this.testRepository.findById(new TestId(testId));
    if (!test) {
      throw new TestNotFoundError(testId);
    }
    return test;
  }

  private async getTestTypeOrFail(testTypeId: TestTypeId) {
    const testType = await this.testTypeRepository.findById(testTypeId);
    if (!testType) {
      throw new ResourceNotFoundError('testType', testTypeId.value);
    }
    return testType;
  }

  private async validateAccessAndPermissionToAddResults(actor: User, testType: TestType) {
    if (actor.permissions.indexOf(testType.neededPermissionToAddResults) === -1) {
      throw new AccessDeniedError(testType.neededPermissionToAddResults);
    }
  }

  private getResults(actorUserId: UserId, testType: TestType, results?: TestResultsCommand) {
    if (!results || !results.details) {
      throw new DomainValidationError('test.results', 'Results must not be undefined');
    }

    return testResultsFactory.create(actorUserId, testType, results.details);
  }
}
