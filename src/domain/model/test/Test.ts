import { UserId } from '../user/UserId';
import { TestTypeId } from '../testType/TestTypeId';
import { TestId } from './TestId';
import { Results } from './Results';
import { ConfidenceLevel } from './ConfidenceLevel';
import { TestType } from '../testType/TestType';
import { Validators } from '../../Validators';
import { DomainValidationError } from '../DomainValidationError';

export class Test {
  private _results?: Results;

  constructor(
    readonly id: TestId,
    readonly userId: UserId,
    readonly testTypeId: TestTypeId,
    readonly administrationConfidence: ConfidenceLevel,
    readonly creationTime: Date = new Date()
  ) {}

  setResults(results: Results, testType: TestType) {
    if (!this.testTypeId.equals(testType.id)) {
      throw new DomainValidationError('results', 'Attempted to validate results against the wrong test type');
    }
    Validators.validateJson('results', results.details, testType.resultsSchema);

    this._results = results;
  }

  get results() {
    return this._results;
  }
}
