import { AssignmentAction, AssignmentId } from './AssignmentAction';
import { AssignmentActionType } from './AssignmentActionType';
import { UserId } from '../user/UserId';

export class AssignmentActions<T, R> {
  readonly newAssignmentActions: Array<AssignmentAction<T, R>> = [];

  constructor(
    private assignmentActions: AssignmentAction<T, R>[],
    private getKey: (resource: R) => string | number
  ) {}

  activeAssignments(): Array<R> {
    const groupedAssignmentActions = this.groupAssignmentActionsByResourceId();
    return this.getActiveAssignedResources(groupedAssignmentActions);
  }

  addAssignment(resource: R, assignTo: T, actor: UserId) {
    this.newAssignmentAction(
      new AssignmentAction(
        new AssignmentId(),
        assignTo,
        resource,
        AssignmentActionType.ADD,
        actor,
        this.assignmentActions.length + 1
      )
    );
  }

  removeAssignment(resource: R, assignTo: T, actor: UserId) {
    this.newAssignmentAction(
      new AssignmentAction(
        new AssignmentId(),
        assignTo,
        resource,
        AssignmentActionType.REMOVE,
        actor,
        this.assignmentActions.length + 1
      )
    );
  }

  private groupAssignmentActionsByResourceId(): Map<
    string | number,
    Array<AssignmentAction<T, R>>
  > {
    const groupedAssignmentActions = new Map();

    this.assignmentActions.forEach((assignment) => {
      const assignedResourceKey = this.getKey(assignment.assignedResource);
      const assignmentsForPermissionId = groupedAssignmentActions.get(
        assignedResourceKey
      );
      assignmentsForPermissionId
        ? assignmentsForPermissionId.push(assignment)
        : groupedAssignmentActions.set(assignedResourceKey, [assignment]);
    });
    return groupedAssignmentActions;
  }

  private getActiveAssignedResources(
    groupedAssignmentActions: Map<
      string | number,
      Array<AssignmentAction<T, R>>
    >
  ): R[] {
    const activeAssignments: R[] = [];
    groupedAssignmentActions.forEach((assignments, key) => {
      const latestAssignmentAction = assignments.reduce((p1, p2) =>
        p1.order < p2.order ? p2 : p1
      );
      if (latestAssignmentAction.actionType === AssignmentActionType.ADD) {
        activeAssignments.push(latestAssignmentAction.assignedResource);
      }
    });
    return activeAssignments;
  }

  private newAssignmentAction(action: AssignmentAction<T, R>) {
    const isCurrentlyAssigned = this.activeAssignments().find(
      (t) => this.getKey(t) === this.getKey(action.assignedResource)
    );
    const acceptableActionType = isCurrentlyAssigned
      ? AssignmentActionType.REMOVE
      : AssignmentActionType.ADD;
    if (action.actionType !== acceptableActionType) {
      return;
    }
    this.assignmentActions.push(action);
    this.newAssignmentActions.push(action);
  }
}
