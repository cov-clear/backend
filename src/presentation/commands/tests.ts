export interface TestCommand {
  testTypeId: string;
  results?: TestResultsCommand;
}

export interface TestResultsCommand {
  details: object;
  notes?: string;
}
