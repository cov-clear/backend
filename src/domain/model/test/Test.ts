import { UserId } from '../user/UserId';
import { TestTypeId } from '../testType/TestTypeId';
import { TestId } from './TestId';
import { Results } from './Results';
import { ConfidenceLevel } from './ConfidenceLevel';

export class Test {
  constructor(
    readonly id: TestId,
    readonly userId: UserId,
    readonly testTypeId: TestTypeId,
    readonly administrationConfidence: ConfidenceLevel,
    public results?: Results,
    readonly creationTime: Date = new Date()
  ) {}
}
