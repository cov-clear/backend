import { UserId } from '../user/UserId';

export class Results {
  constructor(
    public createdBy: UserId,
    public details: object,
    readonly creationTime: Date = new Date()
  ) {}
}
