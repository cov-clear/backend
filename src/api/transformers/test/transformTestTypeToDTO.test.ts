import { aTestType } from '../../../test/domainFactories';
import { transformTestTypeToDTO } from './transformTestTypeToDTO';

describe('transformTestTypeToDTO', () => {
  it('correctly transforms a test type', () => {
    const testType = aTestType();

    const testTypeDTO = transformTestTypeToDTO(testType);

    expect(testTypeDTO.id).toEqual(testType.id.value);
    expect(testTypeDTO.name).toEqual(testType.name);
    expect(testTypeDTO.neededPermissionToAddResults).toEqual(testType.neededPermissionToAddResults);
    expect(testTypeDTO.resultsSchema).toEqual(testType.resultsSchema);
  });
});
