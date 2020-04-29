import { User } from '../domain/model/user/User';
import { UserId } from '../domain/model/user/UserId';
import { Email } from '../domain/model/user/Email';
import { Profile } from '../domain/model/user/Profile';
import { Sex } from '../domain/model/user/Sex';
import { Address } from '../domain/model/user/Address';
import { Country } from '../domain/model/user/Country';
import { DateOfBirth } from '../domain/model/user/DateOfBirth';
import { Role } from '../domain/model/authentication/Role';
import { Permission } from '../domain/model/authentication/Permission';
import { v4 } from 'uuid';
import { TestType } from '../domain/model/test/testType/TestType';
import { TestTypeId } from '../domain/model/test/testType/TestTypeId';
import { Test } from '../domain/model/test/Test';
import { TestId } from '../domain/model/test/TestId';
import { Results } from '../domain/model/test/Results';
import { ConfidenceLevel } from '../domain/model/test/ConfidenceLevel';
import { InterpretationRules } from '../domain/model/test/interpretation/InterpretationRules';
import { InterpretationTheme } from '../domain/model/test/interpretation/Interpretation';
import { ADD_TAKE_HOME_TEST_RESULT } from '../domain/model/authentication/Permissions';
import { AuthenticationDetails } from '../domain/model/user/AuthenticationDetails';
import { AuthenticationMethod } from '../domain/model/user/AuthenticationMethod';
import { AuthenticationValue } from '../domain/model/user/AuthenticationValue';

export function aNewUser() {
  return User.create(magicLinkAuthenticationDetails());
}

export function magicLinkAuthenticationDetails(email = `${v4()}@example.com`) {
  return new AuthenticationDetails(AuthenticationMethod.MAGIC_LINK, new AuthenticationValue(email));
}

export function anEmail() {
  return new Email(`${v4()}@example.com`);
}

export function aUserWithAllInformation() {
  return new User(new UserId(), magicLinkAuthenticationDetails(), anEmail(), aProfile(), anAddress());
}

export function aProfile() {
  return new Profile('John', 'Lennon', DateOfBirth.fromString('1940-10-09'), Sex.MALE);
}

export function anAddress() {
  return new Address('41 Some building', 'Some street', 'London', 'Region', 'E8132', new Country('GR'));
}

export function aRoleWithoutPermissions(roleName = 'USER_ROLE') {
  return new Role(roleName);
}

export function aRoleWithPermissions(
  roleName = 'USER',
  permissions = [aPermission('ADD_TAKE_HOME_REST_RESULT'), aPermission('ADD_PCR_TEST_RESULT')]
): Role {
  const role = aRoleWithoutPermissions(roleName);
  permissions.forEach((permission) => role.assignPermission(permission, new UserId()));
  return role;
}

export function aPermission(permissionName = 'ADD_PCR_TEST') {
  return new Permission(permissionName);
}

export function aTestType(
  name = 'PCR',
  permission = 'PCR_PERMISSION',
  id = new TestTypeId(),
  resultsSchema = {
    type: 'object',
    properties: {
      c: { type: 'boolean', title: 'C' },
      igg: { type: 'boolean', title: 'IgG' },
      igm: { type: 'boolean', title: 'IgM' },
    },
  }
) {
  return new TestType(id, name, resultsSchema, permission);
}

export function aTest(
  userId = new UserId(),
  testType = aTestType(),
  administeringUserId = new UserId(),
  results = aResult(userId),
  testId = new TestId(),
  creationTime = new Date()
) {
  const test = new Test(testId, userId, testType, administeringUserId, ConfidenceLevel.HIGH, creationTime);
  test.setResults(results);
  return test;
}

export function aResult(userId = new UserId(), details = { c: true, igg: true, igm: true }, notes = 'results notes') {
  return new Results(userId, details, ConfidenceLevel.LOW, notes);
}

export function antibodyTestType() {
  return new TestType(
    new TestTypeId(),
    'COVID19 Take Home Antibody Test',
    antibodyResultsSchema(),
    ADD_TAKE_HOME_TEST_RESULT,
    antibodyTestTypeInterpretationRules()
  );
}

export function antibodyResultsSchema() {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'COVID-19 Take Home Test',
    type: 'object',
    properties: {
      c: {
        title: 'Control',
        type: 'boolean',
        description: "Indicator if sample doesn't show COVID-19",
      },
      igg: {
        title: 'IgG',
        type: 'boolean',
        description: 'Indicator if sample shows IgG positive',
      },
      igm: {
        title: 'IgM',
        type: 'boolean',
        description: 'Indicator if sample shows IgM positive',
      },
    },
  };
}

export function antibodyTestTypeInterpretationRules() {
  return InterpretationRules.fromSchema([
    {
      output: {
        namePattern: 'IgG antibodies found',
        theme: InterpretationTheme.POSITIVE,
        variables: {},
      },
      condition: {
        type: 'object',
        properties: {
          c: { type: 'boolean', const: true },
          igg: { type: 'boolean', const: true },
        },
        required: ['c', 'igg'],
      },
    },
    {
      output: {
        namePattern: 'IgG antibodies not found',
        theme: InterpretationTheme.MUTED,
        variables: {},
      },
      condition: {
        type: 'object',
        properties: {
          c: { type: 'boolean', const: true },
          igg: { type: 'boolean', const: false },
        },
        required: ['c', 'igg'],
      },
    },
    {
      output: {
        namePattern: 'IgM antibodies found',
        theme: InterpretationTheme.NEUTRAL,
      },
      condition: {
        type: 'object',
        properties: {
          c: { type: 'boolean', const: true },
          igm: { type: 'boolean', const: true },
        },
        required: ['c', 'igm'],
      },
    },
    {
      output: {
        namePattern: 'IgM antibodies not found',
        theme: InterpretationTheme.MUTED,
      },
      condition: {
        type: 'object',
        properties: {
          c: { type: 'boolean', const: true },
          igm: { type: 'boolean', const: false },
        },
        required: ['c', 'igm'],
      },
    },
    {
      output: {
        namePattern: 'Test Invalid',
        theme: InterpretationTheme.MUTED,
      },
      condition: {
        type: 'object',
        properties: {
          c: { type: 'boolean', const: false },
        },
        required: ['c'],
      },
    },
  ]);
}
