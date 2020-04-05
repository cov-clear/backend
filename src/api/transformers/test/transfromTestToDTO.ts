import { Test } from '../../../domain/model/test/Test';
import { TestDTO } from '../../interface';
import { transformTestTypeToDTO } from './transformTestTypeToDTO';
import { transformTestResultsToDTO } from './transformTestResultsToDTO';
import { transformTestInterpretationToDTO } from './transformTestInterpretationToDTO';

export function transformTestToDTO(test: Test): TestDTO {
  return {
    id: test.id.value,
    userId: test.userId.value,
    creationTime: test.creationTime,
    administrationConfidence: test.administrationConfidence,
    results: test.results ? transformTestResultsToDTO(test.results) : null,
    testType: transformTestTypeToDTO(test.testType),
    resultsInterpretations: test.interpretations.map(transformTestInterpretationToDTO),
  };
}
