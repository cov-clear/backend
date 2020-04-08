import { UpdateTestTypeCommand } from '../../../api/interface';
import { TestType } from '../../../domain/model/test/testType/TestType';
import { TestTypeNotFoundError, TestTypeRepository } from '../../../domain/model/test/testType/TestTypeRepository';
import { TestTypeId } from '../../../domain/model/test/testType/TestTypeId';
import { InterpretationRules } from '../../../domain/model/test/interpretation/InterpretationRules';

export class UpdateTestType {
  constructor(private testTypeRepository: TestTypeRepository) {}

  async execute(testTypeId: string, command: UpdateTestTypeCommand): Promise<TestType> {
    const testType = await this.getTestTypeOrFail(testTypeId);

    if (command.name) {
      testType.name = command.name;
    }

    if (command.resultsSchema) {
      testType.resultsSchema = command.resultsSchema;
    }

    if (command.neededPermissionToAddResults) {
      testType.neededPermissionToAddResults = command.neededPermissionToAddResults;
    }

    if (command.interpretationRules) {
      testType.interpretationRules = InterpretationRules.fromSchema(command.interpretationRules);
    }

    return this.testTypeRepository.save(testType);
  }

  private async getTestTypeOrFail(testTypeId: string) {
    const testType = await this.testTypeRepository.findById(new TestTypeId(testTypeId));
    if (!testType) {
      throw new TestTypeNotFoundError(testTypeId);
    }
    return testType;
  }
}
