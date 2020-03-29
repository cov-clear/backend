export class ResourceNotFoundError extends Error {
  constructor(readonly resourceName: string, readonly resourceId: any) {
    super(`Resource [${resourceName}] with id [${resourceId}] was not found`);
  }
}
