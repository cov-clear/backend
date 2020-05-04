export class InvalidDomainStateError extends Error {
  constructor(message: string) {
    super(`Domain is invalid due to: ${message}`);
  }
}
