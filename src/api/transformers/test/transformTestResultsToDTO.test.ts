import { aResult } from '../../../test/domainFactories';
import { transformTestTypeToDTO } from './transformTestTypeToDTO';
import { transformTestResultsToDTO } from './transformTestResultsToDTO';

describe('transformTestTypeToDTO', () => {
  it('correctly transforms a test type', () => {
    const testResults = aResult();

    const testResultsDTO = transformTestResultsToDTO(testResults);

    expect(testResultsDTO.creationTime).toEqual(testResults.creationTime);
    expect(testResultsDTO.notes).toEqual(testResults.notes);
    expect(testResultsDTO.details).toEqual(testResults.details);
    expect(testResultsDTO.creator.userId).toEqual(testResults.creatorUserId.value);
    expect(testResultsDTO.creator.confidence).toEqual(testResults.creatorConfidence);
  });
});
