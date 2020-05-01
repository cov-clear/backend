import { AuthenticationMethod } from '../user/AuthenticationMethod';

export type AuthCode = string;
export type Token = string;
export interface Authenticator {
  handles: AuthenticationMethod;
  authenticate(authCode: AuthCode): Promise<Token>;
}
