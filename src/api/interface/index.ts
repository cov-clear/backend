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
  region?: string;
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

export interface TestInterpretationDTO {
  namePattern: string;
  theme: string;
  variables: object;
}

export interface TestTypeDTO {
  id: string;
  name: string;
  resultsSchema: object;
  neededPermissionToAddResults: string;
}

export interface TestDTO {
  id: string;
  userId: string;
  creationTime: Date;
  testType: TestTypeDTO;
  administrationConfidence: string;
  resultsInterpretations: TestInterpretationDTO[];
  results: TestResultsDTO | null;
}

export interface TestResultsDTO {
  details: object;
  testerUserId: string;
  creationTime: Date;
  notes: string;
  entryConfidence: string;
}

export interface TestCommand {
  testTypeId: string;
  results?: TestResultsCommand;
}

export interface TestResultsCommand {
  details: object;
  notes?: string;
}
