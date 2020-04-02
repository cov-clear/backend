import { DomainValidationError } from '../DomainValidationError';
import { UserId } from '../user/UserId';
import { TestType } from '../testType/TestType';
import { Validators } from '../../Validators';

export class Results {
  constructor(
    readonly createdBy: UserId,
    readonly details: object,
    readonly notes: string = '',
    readonly creationTime: Date = new Date()
  ) {}
}

// TODO: This validation should be probably be part of the addResult() method of Test
export class ResultsFactory {
  constructor() {}

  create(userId: UserId, testType: TestType, details: object, notes?: string): Results {
    Validators.validateJson('result.details', details, testType.resultsSchema);

    return new Results(userId, details, notes);
  }
}
