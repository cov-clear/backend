export class AuthenticationMethod {
  static magicLink = () => new AuthenticationMethod(AuthenticationMethodType.MAGIC_LINK);
  static estonianId = () => new AuthenticationMethod(AuthenticationMethodType.ESTONIAN_ID);

  constructor(readonly type: AuthenticationMethodType) {}

  public get supported() {
    // TODO: read this from config
    return true;
  }
}

export enum AuthenticationMethodType {
  MAGIC_LINK = 'MAGIC_LINK',
  ESTONIAN_ID = 'ESTONIAN_ID',
}

export function fromString(key: string): AuthenticationMethodType {
  const method = AuthenticationMethodType[key as AuthenticationMethodType];

  if (!method) {
    throw Error(`[${key}] is not a valid AuthenticationMethod key`);
  }

  return method;
}
