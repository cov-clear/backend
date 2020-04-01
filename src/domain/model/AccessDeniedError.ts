export class AccessDeniedError extends Error {
  constructor(readonly missingPermission: string) {
    super(`You need a ${missingPermission} to perform this action`);
  }
}
