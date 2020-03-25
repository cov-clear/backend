export class DomainValidationError extends Error {
  constructor(public field: string, public reason: string) {
    super(`[${field}] is invalid due to: ${reason}`);
  }
}
