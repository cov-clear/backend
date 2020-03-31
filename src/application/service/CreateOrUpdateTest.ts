import { UserId } from '../../domain/model/user/UserId';
import { Test } from '../../domain/model/test/Test';
import { TestId } from '../../domain/model/test/TestId';
import { Results } from '../../domain/model/test/Results';
import { TestRepository } from '../../domain/model/test/TestRepository';
import { getTestTypes } from './index';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';
import { TestCommand } from '../../api/interface/index';
import jsonschema from 'jsonschema';

import { DomainValidationError } from '../../domain/model/DomainValidationError';
import { ResourceNotFoundError } from '../../domain/model/ResourceNotFoundError';

export class CreateOrUpdateTest {
  constructor(private testRepository: TestRepository) {}

  public async execute(userId: string, payload: TestCommand): Promise<Test> {
    const { testTypeId, results } = payload;
    const testType = await getTestTypes.byId(testTypeId);

    if (!testType) {
      throw new ResourceNotFoundError('testTypeId', testTypeId);
    }

    if (results) {
      const validator = new jsonschema.Validator();
      const isValid =
        validator.validate(results.details, testType.resultsSchema).errors
          .length === 0;

      if (!isValid) {
        throw new DomainValidationError(
          'results.details',
          'Invalid results format'
        );
      }
    }

    const resultsObject =
      results && results.details
        ? new Results(new UserId(userId), results.details)
        : undefined;

    const test = new Test(
      new TestId(),
      new UserId(userId),
      new TestTypeId(testTypeId),
      resultsObject
    );

    return this.testRepository.save(test);
  }
}
