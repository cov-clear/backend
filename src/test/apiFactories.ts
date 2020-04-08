import { aResult } from './domainFactories';

import { TestTypeId } from '../domain/model/test/testType/TestTypeId';
import { AddressDTO, ProfileDTO } from '../presentation/dtos/users';
import { TestCommand, TestResultsCommand } from '../presentation/commands/tests';
import { CreateTestTypeCommand } from '../presentation/commands/testTypes';
import { InterpretationRuleDTO } from '../presentation/dtos/testTypes';

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
    interpretationRules: [anInterpretationRuleDTO()],
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

export function anInterpretationRuleDTO(): InterpretationRuleDTO {
  return {
    output: {
      namePattern: 'Some pattern {{var}}',
      theme: 'NEGATIVE',
      propertyVariables: {
        var: 'b',
      },
    },
    condition: { type: 'object' },
  };
}
