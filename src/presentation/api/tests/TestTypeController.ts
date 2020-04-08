import { createTestType, getTestTypes, updateTestType } from '../../../application/service';

import { AuthenticatedRequest, getAuthenticationOrFail } from '../../../api/AuthenticatedRequest';

import { isAuthenticated } from '../../middleware/isAuthenticated';
import { Body, Get, HttpCode, JsonController, Param, Patch, Post, Req, UseAfter, UseBefore } from 'routing-controllers';
import { hasPermission } from '../../middleware/hasPermission';
import { CREATE_TEST_TYPE, UPDATE_TEST_TYPE } from '../../../domain/model/authentication/Permissions';
import { transformTestTypeToDTO } from '../../transformers/tests/transformTestTypeToDTO';
import { TestTypeErrorHandler } from './TestTypeErrorHandler';
import { CreateTestTypeCommand, UpdateTestTypeCommand } from '../../commands/testTypes';

@JsonController('/v1/test-types')
@UseBefore(isAuthenticated)
@UseAfter(TestTypeErrorHandler)
export class TestTypeController {
  private getTestTypes = getTestTypes;
  private createTestType = createTestType;
  private updateTestType = updateTestType;

  @Get('')
  async getTestsOfUser(@Req() req: AuthenticatedRequest) {
    const authentication = getAuthenticationOrFail(req);

    const testTypes = await this.getTestTypes.forPermissions(authentication.permissions);

    return testTypes.map(transformTestTypeToDTO);
  }

  @Post('')
  @HttpCode(201)
  @UseBefore(hasPermission(CREATE_TEST_TYPE))
  async createTestForUser(@Body() command: CreateTestTypeCommand) {
    const testType = await this.createTestType.execute(command);

    return transformTestTypeToDTO(testType);
  }

  @Patch('/:id')
  @UseBefore(hasPermission(UPDATE_TEST_TYPE))
  async updateTestWithResults(@Param('id') testTypeId: string, @Body() command: UpdateTestTypeCommand) {
    const testType = await this.updateTestType.execute(testTypeId, command);
    return transformTestTypeToDTO(testType);
  }
}
