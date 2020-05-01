export enum AuthenticationMethod {
  MAGIC_LINK = 'MAGIC_LINK',
  ESTONIAN_ID = 'ESTONIAN_ID',
}

export namespace AuthenticationMethod {
  export function fromString(key: string): AuthenticationMethod {
    const method = AuthenticationMethod[key as AuthenticationMethod];

    if (!method) {
      throw Error(`[${key}] is not a valid AuthenticationMethod key`);
    }

    return method;
  }
}
