import { AuthenticationSession, AuthenticationSessionToken, AuthenticationResult } from './models';

export interface AuthenticationProvider {
  createSession(): Promise<AuthenticationSession>;
  authenticate(token: AuthenticationSessionToken): Promise<AuthenticationResult>;
}
