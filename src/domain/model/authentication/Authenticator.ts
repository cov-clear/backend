import { AuthenticationMethodType } from '../user/AuthenticationMethod';

export type AuthCode = string;
export type Token = string;
export interface Authenticator {
  handles: AuthenticationMethodType;
  authenticate(authCode: AuthCode): Promise<Token>;
}
