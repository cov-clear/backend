import { UserId } from '../user/UserId';
import { TestType } from '../testType/TestType';

import { DomainValidationError } from '../DomainValidationError';
import Ajv from 'ajv';

const jsonSchema = new Ajv({
  strictDefaults: true,
  strictKeywords: true,
});

export class Results {
  constructor(public createdBy: UserId, public details: object, readonly creationTime: Date = new Date()) {}
}

export class ResultsFactory {
  constructor() {}

  create(userId: UserId, testType: TestType, details: object): Results {
    if (!details) {
      throw new DomainValidationError('results.details', 'Details are required');
    }

    const isValid = jsonSchema.validate(testType.resultsSchema, details);

    if (!isValid) {
      throw new DomainValidationError('results.details', 'Invalid results format');
    }

    return new Results(userId, details);
  }
}
