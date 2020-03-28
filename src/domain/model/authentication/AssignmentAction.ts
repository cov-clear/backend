import { Uuid } from '../../Uuid';
import { AssignmentActionType } from './AssignmentActionType';
import { UserId } from '../user/UserId';

export class AssignmentAction<T, R> {
  constructor(
    readonly id: AssignmentId,
    readonly assignedTo: T,
    readonly assignedResource: R,
    readonly actionType: AssignmentActionType,
    readonly actor: UserId,
    readonly order: number,
    readonly creationTime: Date = new Date()
  ) {}
}

export class AssignmentId extends Uuid {}
