export class AuthenticationError extends Error {
  constructor(message: string) {
    super(`Authentication failed: ${message}`);
  }
}
