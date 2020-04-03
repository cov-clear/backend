export interface UpdateUserCommand {
  profile?: Profile;
  address?: Address;
}

export interface TestType {
  id: string;
  name: string;
  resultsSchema: object;
  neededPermissionToAddResults: string;
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
  notes?: string;
}
