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
import { TestType } from '../domain/model/testType/TestType';
import { TestTypeId } from '../domain/model/testType/TestTypeId';
import { Test } from '../domain/model/test/Test';
import { TestId } from '../domain/model/test/TestId';
import { Results } from '../domain/model/test/Results';
import { ConfidenceLevel } from '../domain/model/test/ConfidenceLevel';

export function aNewUser() {
  return new User(new UserId(), anEmail());
}

export function anEmail() {
  return new Email(`${v4()}@example.com`);
}

export function aUserWithAllInformation() {
  return new User(new UserId(), anEmail(), aProfile(), anAddress());
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
  testTypeId = new TestTypeId(),
  results = aResult(userId),
  testId = new TestId(),
  creationTime = new Date()
) {
  const testType = aTestType('PCR', 'PCR_PERMISSION', testTypeId);
  const test = new Test(testId, userId, testTypeId, ConfidenceLevel.HIGH, creationTime);
  test.setResults(results, testType);
  return test;
}

export function aResult(userId = new UserId(), details = { c: true, igg: true, igm: true }, notes = 'results notes') {
  return new Results(userId, details, ConfidenceLevel.LOW, notes);
}
