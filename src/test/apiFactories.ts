import { aResult } from './domainFactories';
import { CreateTestTypeCommand, TestCommand, TestResultsCommand } from '../api/interface';

import { AddressDTO, ProfileDTO } from '../presentation/dtos/users';
import { TestTypeId } from '../domain/model/test/testType/TestTypeId';

export function anApiAddress(): AddressDTO {
  return {
    address1: 'Some address',
    address2: 'Some street',
    city: 'London',
    countryCode: 'GB',
    postcode: 'E8123',
    region: 'Some Region',
  };
}

export function anApiProfile(): ProfileDTO {
  return {
    firstName: 'John',
    lastName: 'Lennon',
    dateOfBirth: '1940-10-09',
    sex: 'MALE',
  };
}

export function aCreateTestTypeCommand(
  name = 'TestTypeName',
  permission = 'PERMISSION',
  schema = {}
): CreateTestTypeCommand {
  return {
    name,
    resultsSchema: schema,
    neededPermissionToAddResults: permission,
  };
}

export function aCreateTestCommand(testTypeId = new TestTypeId()): TestCommand {
  return {
    testTypeId: testTypeId.value,
  };
}

export function aTestResultsCommand(): TestResultsCommand {
  return {
    details: aResult().details,
  };
}
