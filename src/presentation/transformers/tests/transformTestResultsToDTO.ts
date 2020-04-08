import { Results } from '../../../domain/model/test/Results';
import { TestResultsDTO } from '../../dtos/tests/TestResultDTO';

export function transformTestResultsToDTO(results: Results): TestResultsDTO {
  return {
    details: results.details,
    creator: {
      userId: results.creatorUserId.value,
      confidence: results.creatorConfidence,
    },
    creationTime: results.creationTime,
    notes: results.notes,
  };
}
