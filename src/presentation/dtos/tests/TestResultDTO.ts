export interface TestResultsDTO {
  details: object;
  creationTime: Date;
  notes: string;
  creator: {
    userId: string;
    confidence: string;
  };
}
