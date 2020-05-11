import { TestTypeDTO } from './TestTypeDTO';
import { TestInterpretationDTO } from './TestInterpretationDTO';
import { TestResultsDTO } from './TestResultDTO';

export interface TestDTO {
  id: string;
  userId: string;
  creationTime: Date;
  testType: TestTypeDTO;
  creator: {
    userId: string;
    confidence: string;
  };
  resultsInterpretations: TestInterpretationDTO[];
  results: TestResultsDTO | null;
}
