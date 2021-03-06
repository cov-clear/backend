import { TestType } from '../../../domain/model/test/testType/TestType';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { TestTypeRepository } from '../../../domain/model/test/testType/TestTypeRepository';
import { InterpretationRules } from '../../../domain/model/test/interpretation/InterpretationRules';
import { CreateTestTypeCommand } from '../../../presentation/commands/tests/CreateTestTypeCommand';

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
    command.neededPermissionToAddResults,
    InterpretationRules.fromSchema(command.interpretationRules)
  );
}
