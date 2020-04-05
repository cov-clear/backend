import { Results } from '../../../domain/model/test/Results';
import { TestResultsDTO } from '../../interface';

export function transformTestResultsToDTO(results: Results): TestResultsDTO {
  return {
    details: results.details,
    createdBy: {
      userId: results.createdBy.value,
    },
    creationTime: results.creationTime,
    entryConfidence: results.entryConfidence,
    notes: results.notes,
  };
}
