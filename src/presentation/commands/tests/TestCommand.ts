import { TestResultsCommand } from './TestResultsCommand';

export interface TestCommand {
  testTypeId: string;
  results?: TestResultsCommand;
}
