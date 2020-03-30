import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestType } from '../../domain/model/testType/TestType';
import { CreateTestTypeCommand } from '../../api/interface';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';

export class CreateTestType {
  constructor(private testTypeRepository: TestTypeRepository) {}

  async execute(command: CreateTestTypeCommand): Promise<TestType> {
    const testType = getTestType(command);
    return this.testTypeRepository.save(testType);
  }
}

function getTestType(command: CreateTestTypeCommand) {
  return new TestType(
    new TestTypeId(),
    command.name,
    command.resultsSchema,
    command.neededPermissionToAddResults
  );
}
