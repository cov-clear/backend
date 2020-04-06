import { aTest } from '../../../test/domainFactories';
import { transformTestToDTO } from './transfromTestToDTO';

describe('transformTestToDTO', () => {
  it('correctly transforms a test', () => {
    const test = aTest();

    const testDTO = transformTestToDTO(test);

    expect(testDTO.id).toEqual(test.id.value);
    expect(testDTO.userId).toEqual(test.userId.value);
    expect(testDTO.creationTime).toEqual(test.creationTime);
    expect(testDTO.creator.userId).toEqual(test.creatorUserId.value);
    expect(testDTO.creator.confidence).toEqual(test.creatorConfidence);

    expect(testDTO.testType).toBeDefined();
    expect(testDTO.results).toBeDefined();

    expect(Array.isArray(testDTO.resultsInterpretations)).toBe(true);
  });
});
