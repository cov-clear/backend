import { aTestType } from '../../../test/domainFactories';
import { transformTestTypeToSimpleDTO } from './transformTestTypeToSimpleDTO';

describe('transformTestTypeToSimpleDTO', () => {
  it('correctly transforms a test type', () => {
    const testType = aTestType();

    const testTypeDTO = transformTestTypeToSimpleDTO(testType);

    expect(testTypeDTO.id).toEqual(testType.id.value);
    expect(testTypeDTO.name).toEqual(testType.name);
    expect(testTypeDTO.neededPermissionToAddResults).toEqual(testType.neededPermissionToAddResults);
  });
});
