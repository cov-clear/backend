export class ResourceNotFoundError extends Error {
  constructor(resourceName: string, resourceId: any) {
    super(`Resource [${resourceName}] with id [${resourceId}] was not found`);
  }
}
