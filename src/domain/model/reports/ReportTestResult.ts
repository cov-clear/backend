import { UserId } from '../user/UserId';
import { TestId } from '../test/TestId';
import { Results } from '../test/Results';
import { ConfidenceLevel } from '../test/ConfidenceLevel';
import { TestType } from '../test/testType/TestType';
import { Validators } from '../../Validators';

export class ReportTestResult {
  constructor(
    readonly id: TestId,
    readonly userId: UserId,
    readonly testType: TestType,
    readonly testCreatorConfidence: string,
    readonly testCreationTime: Date,
    readonly resultsDetails: object,
    readonly resultsCreatorConfidence: string,
    readonly resultsCreationTime: Date
  ) {}
}
