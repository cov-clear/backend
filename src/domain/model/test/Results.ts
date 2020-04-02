import { UserId } from '../user/UserId';
import { TestType } from '../testType/TestType';
import { Validators } from '../../Validators';
import { ConfidenceLevel } from './ConfidenceLevel';

export class Results {
  constructor(
    readonly createdBy: UserId,
    readonly details: object,
    readonly entryConfidence: ConfidenceLevel,
    readonly notes: string = '',
    readonly creationTime: Date = new Date()
  ) {
  }

  static newResults(
    userId: UserId,
    testType: TestType,
    resultsDetails: object,
    entryConfidence: ConfidenceLevel,
    notes: string = '',
  ): Results {
    Validators.validateJson('result.details', resultsDetails, testType.resultsSchema);
    return new Results(userId, resultsDetails, entryConfidence, notes);
  }
}
