import { accessManagerFactory, addResultsToTest, createTest, getTests } from '../../../application/service';
import { UserId } from '../../../domain/model/user/UserId';
import { ApiError, apiErrorCodes } from '../../dtos/ApiError';
import { transformTestToDTO } from '../../transformers/tests/transfromTestToDTO';
import { transformTestResultsToDTO } from '../../transformers/tests/transformTestResultsToDTO';
import {
  Authorized,
  Body,
  BodyParam,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  UseAfter,
} from 'routing-controllers';
import { TestErrorHandler } from './TestErrorHandler';
import { User } from '../../../domain/model/user/User';
import { TestResultsCommand } from '../../commands/tests/TestResultsCommand';
import { TestCommand } from '../../commands/tests/TestCommand';

@Authorized()
@JsonController('/v1')
@UseAfter(TestErrorHandler)
export class TestController {
  private accessManagerFactory = accessManagerFactory;
  private getTests = getTests;
  private createTest = createTest;
  private addResultsToTest = addResultsToTest;

  @Get('/users/:id/tests')
  async getTestsOfUser(@Param('id') userIdValue: string, @CurrentUser({ required: true }) actor: User) {
    await this.validateCanAccessUser(actor, new UserId(userIdValue));

    const tests = await this.getTests.byUserId(userIdValue);

    return tests.map(transformTestToDTO);
  }

  @HttpCode(201)
  @Post('/users/:id/tests')
  async createTestForUser(
    @Param('id') userIdValue: string,
    @Body() testCommand: TestCommand,
    @CurrentUser({ required: true }) actor: User
  ) {
    await this.validateCanAccessUser(actor, new UserId(userIdValue));

    const test = await this.createTest.execute(actor, userIdValue, testCommand);

    return transformTestToDTO(test);
  }

  @Get('/tests/:id')
  async getTestById(@Param('id') testIdValue: string) {
    const test = await this.getTests.byId(testIdValue);

    return transformTestToDTO(test);
  }

  @Patch('/tests/:id')
  async updateTestWithResults(
    @Param('id') testIdValue: string,
    @BodyParam('results') resultsCommand: TestResultsCommand,
    @CurrentUser({ required: true }) actor: User
  ) {
    const results = await this.addResultsToTest.execute(actor, testIdValue, resultsCommand);

    return transformTestResultsToDTO(results);
  }

  private async validateCanAccessUser(actor: User, userIdToBeAccessed: UserId) {
    const canAccessUser = await this.accessManagerFactory.forAuthenticatedUser(actor).canAccessUser(userIdToBeAccessed);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
