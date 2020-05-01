import { AuthenticationMethod } from '../user/AuthenticationMethod';
import { AuthenticationIdentifier } from '../user/AuthenticationIdentifier';

export type Token = string;
export interface Authenticator {
  handles: AuthenticationMethod;
  authenticate(identifier: AuthenticationIdentifier): Promise<Token>;
}
