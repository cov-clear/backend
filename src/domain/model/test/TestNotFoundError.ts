import { ResourceNotFoundError } from '../ResourceNotFoundError';

export class TestNotFoundError extends ResourceNotFoundError {
  constructor(readonly testId: string) {
    super('test', testId);
  }
}
