import { accessManagerFactory, addResultsToTest, createTest, getTests } from '../../../application/service';

import { AuthenticatedRequest, getAuthenticationOrFail } from '../../../api/AuthenticatedRequest';
import { UserId } from '../../../domain/model/user/UserId';

import { isAuthenticated } from '../../middleware/isAuthenticated';
import { ApiError, apiErrorCodes } from '../../../api/ApiError';
import { transformTestToDTO } from '../../transformers/tests/transfromTestToDTO';
import { transformTestResultsToDTO } from '../../transformers/tests/transformTestResultsToDTO';
import { Authentication } from '../../../domain/model/authentication/Authentication';
import {
  Body,
  BodyParam,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  Req,
  UseAfter,
  UseBefore,
} from 'routing-controllers';
import { TestErrorHandler } from './TestErrorHandler';
import { TestCommand, TestResultsCommand } from '../../commands/tests';

@JsonController('/v1')
@UseBefore(isAuthenticated)
@UseAfter(TestErrorHandler)
export class TestController {
  private accessManagerFactory = accessManagerFactory;
  private getTests = getTests;
  private createTest = createTest;
  private addResultsToTest = addResultsToTest;

  @Get('/users/:id/tests')
  async getTestsOfUser(@Param('id') userIdValue: string, @Req() req: AuthenticatedRequest) {
    await this.validateCanAccessUser(getAuthenticationOrFail(req), new UserId(userIdValue));

    const tests = await this.getTests.byUserId(userIdValue);

    return tests.map(transformTestToDTO);
  }

  @HttpCode(201)
  @Post('/users/:id/tests')
  async createTestForUser(
    @Param('id') userIdValue: string,
    @Body() testCommand: TestCommand,
    @Req() req: AuthenticatedRequest
  ) {
    const authentication = getAuthenticationOrFail(req);

    await this.validateCanAccessUser(authentication, new UserId(userIdValue));

    const test = await this.createTest.execute(authentication.user, userIdValue, testCommand);

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
    @Req() req: AuthenticatedRequest
  ) {
    const authentication = getAuthenticationOrFail(req);

    const results = await this.addResultsToTest.execute(authentication.user, testIdValue, resultsCommand);
    return transformTestResultsToDTO(results);
  }

  private async validateCanAccessUser(authentication: Authentication, userIdToBeAccessed: UserId) {
    const canAccessUser = await this.accessManagerFactory
      .forAuthentication(authentication)
      .canAccessUser(userIdToBeAccessed);

    if (!canAccessUser) {
      throw new ApiError(404, apiErrorCodes.USER_NOT_FOUND);
    }
  }
}
