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
    readonly creatorUserId: UserId,
    readonly creatorConfidence: ConfidenceLevel,
    readonly creationTime: Date = new Date()
  ) {}

  setResults(results: Results) {
    Validators.validateJson('results', results.details, this.testType.resultsSchema);
    this._results = results;
  }

  get results() {
    return this._results;
  }

  get interpretations() {
    if (!this.results) {
      return [];
    }
    return this.testType.interpretationRules.interpret(this.results);
  }
}
