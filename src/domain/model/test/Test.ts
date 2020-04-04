import { UserId } from '../user/UserId';
import { TestId } from './TestId';
import { Results } from './Results';
import { ConfidenceLevel } from './ConfidenceLevel';
import { TestType } from './testType/TestType';
import { Validators } from '../../Validators';

export class Test {
  private _results?: Results;

  constructor(
    readonly id: TestId,
    readonly userId: UserId,
    readonly testType: TestType,
    readonly administrationConfidence: ConfidenceLevel,
    readonly creationTime: Date = new Date()
  ) {}

  setResults(results: Results) {
    Validators.validateJson('results', results.details, this.testType.resultsSchema);
    this._results = results;
  }

  get results() {
    return this._results;
  }
}
