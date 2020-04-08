import { Test } from '../../../domain/model/test/Test';
import { ReportDTO } from '../../interface';
import { transformTestResultsToDTO } from './transformTestResultsToDTO';
import * as crypto from 'crypto';

export function transformTestToReportDTO(test: Test, secret: string): ReportDTO {
  const hashedUserId = crypto.createHmac('sha256', secret).update(test.userId.value).digest('hex');

  const transformedResults = test.results ? transformTestResultsToDTO(test.results) : null;

  return {
    id: test.id.value,
    userId: hashedUserId,
    testTypeName: test.testType.name,
    testCreationTime: test.creationTime,
    testCreatorConfidence: test.creatorConfidence,
    resultsDetails: transformedResults ? transformedResults.details : null,
    resultsNotes: transformedResults ? transformedResults.notes : null,
    resultsCreatorConfidence: transformedResults ? transformedResults.creator.confidence : null,
    resultsCreationTime: transformedResults ? transformedResults.creationTime : null,
  };
}
