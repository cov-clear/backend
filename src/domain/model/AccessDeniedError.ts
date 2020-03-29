export class AccessDeniedError extends Error {
  constructor(missingPermission: string) {
    super(`You need a ${missingPermission} to perform this action`);
  }
}
