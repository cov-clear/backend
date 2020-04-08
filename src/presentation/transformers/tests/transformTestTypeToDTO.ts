import { TestType } from '../../../domain/model/test/testType/TestType';
import { TestTypeDTO } from '../../dtos/tests/TestTypeDTO';

export function transformTestTypeToDTO(testType: TestType): TestTypeDTO {
  return {
    id: testType.id.value,
    name: testType.name,
    neededPermissionToAddResults: testType.neededPermissionToAddResults,
    resultsSchema: testType.resultsSchema,
    interpretationRules: testType.interpretationRules.toSchema(),
  };
}
