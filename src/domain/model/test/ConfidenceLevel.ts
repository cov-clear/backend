export enum ConfidenceLevel {
  LOW = 'LOW',
  HIGH = 'HIGH',
}

export namespace ConfidenceLevel {
  export function fromString(confidenceLevelKey: string): ConfidenceLevel {
    switch (confidenceLevelKey) {
      case ConfidenceLevel.LOW:
        return ConfidenceLevel.LOW;
      case ConfidenceLevel.HIGH:
        return ConfidenceLevel.HIGH;
      default:
        throw Error(`[${confidenceLevelKey}] is not a valid ConfidenceLevel key`);
    }
  }
}
