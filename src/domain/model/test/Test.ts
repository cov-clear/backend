import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../user/UserId';
import { TestTypeId } from '../testType/TestTypeId';
import { TestId } from './TestId';

export class Test {
  constructor(
    public id: TestId,
    public userId: UserId,
    public testTypeId: TestTypeId,
    readonly creationTime: Date = new Date()
  ) {}
}
