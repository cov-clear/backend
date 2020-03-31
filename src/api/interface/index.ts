export interface Profile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
}

export interface Address {
  address1: string;
  address2?: string;
  city: string;
  region: string;
  postcode: string;
  countryCode: string;
}

export interface UpdateUserCommand {
  profile?: Profile;
  address?: Address;
}

export interface User {
  id: string;
  email: string;
  creationTime: Date;
  profile?: Profile;
  address?: Address;
}

export interface TestType {
  id: string;
  name: string;
  resultsSchema: object;
}

export interface CreateTestTypeCommand {
  name: string;
  resultsSchema: object;
  neededPermissionToAddResults: string;
}

export interface Role {
  name: string;
  permissions: string[];
}

export interface Permission {
  name: string;
}

export interface TestCommand {
  testTypeId: string;
  results?: TestResultsCommand;
}

export interface TestResultsCommand {
  details: object;
}
