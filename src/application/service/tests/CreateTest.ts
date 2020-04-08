import { UserId } from '../../../domain/model/user/UserId';
import { Test } from '../../../domain/model/test/Test';
import { TestId } from '../../../domain/model/test/TestId';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { TestRepository } from '../../../domain/model/test/TestRepository';
import { TestTypeRepository } from '../../../domain/model/test/testType/TestTypeRepository';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../../domain/model/ResourceNotFoundError';
import { User } from '../../../domain/model/user/User';
import { ConfidenceLevel } from '../../../domain/model/test/ConfidenceLevel';
import { ADMINISTER_TEST_WITH_HIGH_CONFIDENCE } from '../../../domain/model/authentication/Permissions';
import { AddResultsToTest } from './AddResultsToTest';
import { TestCommand } from '../../../presentation/commands/tests/TestCommand';

export class CreateTest {
  constructor(
    private testRepository: TestRepository,
    private testTypeRepository: TestTypeRepository,
    private addResultsToTest: AddResultsToTest
  ) {}

  public async execute(actor: User, subjectUserId: string, testCommand: TestCommand): Promise<Test> {
    const testType = await this.getTestTypeOrFail(testCommand.testTypeId);

    const administrationConfidence = this.getAdministrationConfidence(actor);

    const test = new Test(new TestId(), new UserId(subjectUserId), testType, actor.id, administrationConfidence);

    if (testCommand.results) {
      await this.addResultsToTest.executeForTest(actor, test, testCommand.results);
    }

    return this.testRepository.save(test);
  }

  private async getTestTypeOrFail(testTypeId: string) {
    if (!testTypeId) {
      throw new DomainValidationError('test.testTypeId', 'Tests require a test type');
    }

    const testType = await this.testTypeRepository.findById(new TestTypeId(testTypeId));

    if (!testType) {
      throw new ResourceNotFoundError('testType', testTypeId);
    }

    return testType;
  }

  private getAdministrationConfidence(actor: User) {
    if (actor.permissions.indexOf(ADMINISTER_TEST_WITH_HIGH_CONFIDENCE) !== -1) {
      return ConfidenceLevel.HIGH;
    }
    return ConfidenceLevel.LOW;
  }
}
