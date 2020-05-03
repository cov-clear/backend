import { Profile } from '../user/Profile';

export class AuthenticationSessionToken {
  constructor(readonly value: string) {}
}

export interface AuthenticationSession {
  token: AuthenticationSessionToken;
  redirectUrl: string;
}

export interface AuthenticationResult {
  code: string;
  profile: Profile;
}
