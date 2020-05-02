export class AuthenticationSessionToken {
  constructor(readonly value: string) {}
}

export interface AuthenticationSession {
  token: AuthenticationSessionToken;
  redirectUrl: string;
}

export interface AuthenticationResult {
  code: string;
  firstName: string;
  lastName: string;
}
