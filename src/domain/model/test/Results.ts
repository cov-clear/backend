import { UserId } from '../user/UserId';
import { ConfidenceLevel } from './ConfidenceLevel';

export class Results {
  constructor(
    readonly createdBy: UserId,
    readonly details: object,
    readonly entryConfidence: ConfidenceLevel,
    readonly notes: string = '',
    readonly creationTime: Date = new Date()
  ) {}

  static newResults(
    createdBy: UserId,
    resultsDetails: object,
    entryConfidence: ConfidenceLevel,
    notes: string = ''
  ): Results {
    return new Results(createdBy, resultsDetails, entryConfidence, notes);
  }
}
