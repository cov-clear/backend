import { UserId } from '../user/UserId';

export class Results {
  constructor(
    public createdBy: UserId,
    readonly creationTime: Date = new Date(),
    public details: object
  ) {}
}
