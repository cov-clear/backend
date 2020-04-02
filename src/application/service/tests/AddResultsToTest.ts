import { TestId } from '../../../domain/model/test/TestId';
import { TestTypeId } from '../../../domain/model/testType/TestTypeId';
import { TestRepository } from '../../../domain/model/test/TestRepository';
import { TestTypeRepository } from '../../../domain/model/testType/TestTypeRepository';
import { TestResultsCommand } from '../../../api/interface';
import { ResourceNotFoundError } from '../../../domain/model/ResourceNotFoundError';
import { TestType } from '../../../domain/model/testType/TestType';
import { User } from '../../../domain/model/user/User';
import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { TestNotFoundError } from '../../../domain/model/test/TestNotFoundError';
import { Results } from '../../../domain/model/test/Results';
import { ConfidenceLevel } from '../../../domain/model/test/ConfidenceLevel';
import { ADD_RESULTS_WITH_HIGH_CONFIDENCE } from '../../../domain/model/authentication/Permissions';

export class AddResultsToTest {
  constructor(private testRepository: TestRepository, private testTypeRepository: TestTypeRepository) {}

  public async execute(actor: User, testId: string, resultsCommand: TestResultsCommand): Promise<Results> {
    const test = await this.getTestOrFail(testId);
    const testType = await this.getTestTypeOrFail(test.testTypeId);
    const resultsDetails = this.getResultsDetailsOrFail(resultsCommand);

    await this.validateAccessAndPermissionToAddResults(actor, testType);

    test.setResults(this.getResults(actor, testType, resultsDetails, resultsCommand.notes), testType);

    await this.testRepository.save(test);

    return test.results as Results;
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

  private getResultsDetailsOrFail(results: TestResultsCommand): object {
    if (!results || !results.details) {
      throw new DomainValidationError('test.results', 'Results must not be undefined');
    }
    return results.details;
  }

  private async validateAccessAndPermissionToAddResults(actor: User, testType: TestType) {
    if (actor.permissions.indexOf(testType.neededPermissionToAddResults) === -1) {
      throw new AccessDeniedError(testType.neededPermissionToAddResults);
    }
  }

  private getResults(actor: User, testType: TestType, resultsDetails: object, notes?: string) {
    const confidenceLevel = this.getConfidenceLevel(actor);
    return Results.newResults(actor.id, testType, resultsDetails, confidenceLevel, notes);
  }

  private getConfidenceLevel(actor: User) {
    if (actor.permissions.indexOf(ADD_RESULTS_WITH_HIGH_CONFIDENCE) !== -1) {
      return ConfidenceLevel.HIGH;
    }
    return ConfidenceLevel.LOW;
  }
}
