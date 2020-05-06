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
import { userRepository } from '../../../infrastructure/persistence';
import { emailNotifier } from '../index';
import { Email } from '../../../domain/model/user/Email';
import fs from 'fs';
import * as config from '../../../config';

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

    const patient = await userRepository.findByUserId(test.userId);

    if (patient && patient.id != actor.id) {
      await this.sendEmailForTestResult(patient);
    }

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

  private async sendEmailForTestResult(patient: User) {
    const emailTemplate = (await fs.promises.readFile(
      __dirname + '/../../../../assets/emails/new-test-result.html',
      'UTF-8'
    )) as string;
    const frontendBaseUrl = new URL(config.get('frontend.baseUrl'));

    if (patient.email) {
      await emailNotifier.send(
        new Email(config.get('emailNotifier.fromEmailHeader')),
        new Email(patient.email.value),
        'A new test result has been added to COV-Clear',
        emailTemplate.replace(/{{LINK}}/g, `${frontendBaseUrl}`)
      );
    }

    return true;
  }
}
