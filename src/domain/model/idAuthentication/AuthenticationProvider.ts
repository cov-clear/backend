import { AuthenticationSession, AuthenticationSessionToken, Authentication } from './models';

export interface AuthenticationProvider {
  createSession(): Promise<AuthenticationSession>;
  authenticate(token: AuthenticationSessionToken): Promise<Authentication>;
}
