export class DomainValidationError extends Error {
  constructor(readonly field: string, readonly reason: string) {
    super(`[${field}] is invalid due to: ${reason}`);
  }
}
