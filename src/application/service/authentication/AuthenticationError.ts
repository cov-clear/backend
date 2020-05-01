export class AuthenticationError extends Error {
  constructor(public failureReason: string, message: string = `Authentication failed: ${failureReason}`) {
    super(message);
  }
}
