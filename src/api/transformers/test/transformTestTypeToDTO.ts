import { TestType } from '../../../domain/model/test/testType/TestType';

export function transformTestTypeToDTO(testType: TestType) {
  return {
    id: testType.id.value,
    name: testType.name,
    neededPermissionToAddResults: testType.neededPermissionToAddResults,
    resultsSchema: testType.resultsSchema,
  };
}
