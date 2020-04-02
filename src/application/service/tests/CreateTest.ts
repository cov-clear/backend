import { UserId } from '../../../domain/model/user/UserId';
import { Test } from '../../../domain/model/test/Test';
import { TestId } from '../../../domain/model/test/TestId';
import { TestTypeId } from '../../../domain/model/testType/TestTypeId';
import { TestRepository } from '../../../domain/model/test/TestRepository';
import { TestTypeRepository } from '../../../domain/model/testType/TestTypeRepository';
import { TestCommand, TestResultsCommand } from '../../../api/interface';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../../domain/model/ResourceNotFoundError';
import { TestType } from '../../../domain/model/testType/TestType';
import { User } from '../../../domain/model/user/User';
import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { ConfidenceLevel } from '../../../domain/model/test/ConfidenceLevel';
import { Results } from '../../../domain/model/test/Results';
import { ADMINISTER_TEST_WITH_HIGH_CONFIDENCE } from '../../../domain/model/authentication/Permissions';

export class CreateTest {
  constructor(private testRepository: TestRepository, private testTypeRepository: TestTypeRepository) {}

  public async execute(actor: User, subjectUserId: string, testCommand: TestCommand): Promise<Test> {
    const testType = await this.getTestTypeOrFail(testCommand.testTypeId);

    const results = this.getResults(actor.id, testType, testCommand.results);

    const administrationConfidence = this.getAdministrationConfidence(actor);

    if (results) {
      this.validatePermissionToAddResults(actor, testType);
    }

    const test = new Test(new TestId(), new UserId(subjectUserId), testType.id, administrationConfidence, results);

    return this.testRepository.save(test);
  }

  private validatePermissionToAddResults(actor: User, testType: TestType) {
    if (actor.permissions.indexOf(testType.neededPermissionToAddResults) === -1) {
      throw new AccessDeniedError(testType.neededPermissionToAddResults);
    }
  }

  private getResults(actorUserId: UserId, testType: TestType, results?: TestResultsCommand) {
    if (!results || !results.details) {
      return undefined;
    }

    return Results.newResults(actorUserId, testType, results.details, ConfidenceLevel.LOW, results.notes);
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
