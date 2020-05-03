import { TestId } from '../../../domain/model/test/TestId';
import { TestRepository } from '../../../domain/model/test/TestRepository';
import { TestType } from '../../../domain/model/test/testType/TestType';
import { User } from '../../../domain/model/user/User';
import { AccessDeniedError } from '../../../domain/model/AccessDeniedError';
import { DomainValidationError } from '../../../domain/model/DomainValidationError';
import { TestNotFoundError } from '../../../domain/model/test/TestNotFoundError';
import { Results } from '../../../domain/model/test/Results';
import { ConfidenceLevel } from '../../../domain/model/test/ConfidenceLevel';
import { ADD_RESULTS_WITH_HIGH_CONFIDENCE } from '../../../domain/model/authentication/Permissions';
import { Test } from '../../../domain/model/test/Test';
import { TestResultsCommand } from '../../../presentation/commands/tests/TestResultsCommand';

export class AddResultsToTest {
  constructor(private testRepository: TestRepository) {}

  public async execute(actor: User, testId: string, resultsCommand: TestResultsCommand): Promise<Results> {
    const test = await this.getTestOrFail(testId);
    return this.executeForTest(actor, test, resultsCommand);
  }

  public async executeForTest(actor: User, test: Test, resultsCommand: TestResultsCommand): Promise<Results> {
    const resultsDetails = this.getResultsDetailsOrFail(resultsCommand);

    await this.validateAccessAndPermissionToAddResults(actor, test.testType);

    test.setResults(this.getResults(actor, resultsDetails, resultsCommand.notes));

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

  private getResultsDetailsOrFail(results: TestResultsCommand): object {
    if (!results || !results.details) {
      throw new DomainValidationError('test.results', 'Results must not be undefined');
    }
    return results.details;
  }

  private async validateAccessAndPermissionToAddResults(actor: User, testType: TestType) {
    if (!actor.hasPermission(testType.neededPermissionToAddResults)) {
      throw new AccessDeniedError(testType.neededPermissionToAddResults);
    }
  }

  private getResults(actor: User, resultsDetails: object, notes?: string) {
    const confidenceLevel = this.getConfidenceLevel(actor);
    return Results.newResults(actor.id, resultsDetails, confidenceLevel, notes);
  }

  private getConfidenceLevel(actor: User) {
    if (actor.hasPermission(ADD_RESULTS_WITH_HIGH_CONFIDENCE)) {
      return ConfidenceLevel.HIGH;
    }
    return ConfidenceLevel.LOW;
  }
}
