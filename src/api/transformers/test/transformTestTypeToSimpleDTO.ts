import { TestType } from '../../../domain/model/test/testType/TestType';
import { TestTypeSimpleDTO } from '../../interface';

export function transformTestTypeToSimpleDTO(testType: TestType): TestTypeSimpleDTO {
  return {
    id: testType.id.value,
    name: testType.name,
    neededPermissionToAddResults: testType.neededPermissionToAddResults,
  };
}
