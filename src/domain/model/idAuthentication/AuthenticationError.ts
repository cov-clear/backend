export class AuthenticationError extends Error {
  constructor(message) {
    super(`Authentication failed: ${message}`);
  }
}
