import { AuthenticationMethod, fromString } from './AuthenticationMethod';
import { AuthenticationIdentifier } from './AuthenticationIdentifier';
import { DomainValidationError } from '../DomainValidationError';

export class AuthenticationDetailsFactory {
  constructor() {}

  public forMethodAndIdentifier(method: string, identifier: string): AuthenticationDetails {
    const authenticationMethodType = fromString(method);

    const authenticationDetails = new AuthenticationDetails(
      new AuthenticationMethod(authenticationMethodType),
      new AuthenticationIdentifier(identifier)
    );

    return authenticationDetails;
  }
}

export class AuthenticationDetails {
  constructor(readonly method: AuthenticationMethod, readonly identifier: AuthenticationIdentifier) {
    if (!method.supported) {
      throw new DomainValidationError(
        'authenticationDetails.method',
        `Authentication method not supported: ${method.type}`
      );
    }
  }

  // static createFromMethodAndType(method: string, identifier: string) {
  //   return new User(new UserId(), authenticationDetails);
  // }
}
