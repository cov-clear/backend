import { Address } from './Address';
import { AssignmentActions } from '../authentication/AssignmentActions';
import { DomainValidationError } from '../DomainValidationError';
import { Email } from './Email';
import { Profile } from './Profile';
import { Role } from '../authentication/Role';
import { UserId } from './UserId';
import { AuthenticationDetails } from './AuthenticationDetails';

export class User {
  readonly roleAssignments: AssignmentActions<User, Role>;

  constructor(
    readonly id: UserId,
    readonly authenticationDetails: AuthenticationDetails,
    private _email?: Email,
    private _profile?: Profile,
    private _address?: Address,
    readonly creationTime: Date = new Date(),
    private _modificationTime: Date = new Date()
  ) {
    this.roleAssignments = new AssignmentActions([], (role) => role.name);
  }

  static create(authenticationDetails: AuthenticationDetails) {
    return new User(new UserId(), authenticationDetails);
  }

  set email(newEmail) {
    if (!newEmail) {
      throw new DomainValidationError('email', 'Cannot set email to null or undefined');
    }

    this._email = newEmail;
    this._modificationTime = new Date();
  }

  get email() {
    return this._email;
  }

  set profile(newProfile) {
    if (!newProfile) {
      throw new DomainValidationError('profile', 'Cannot set profile to null or undefined');
    }

    this._profile = newProfile;
    this._modificationTime = new Date();
  }

  get profile() {
    return this._profile;
  }

  set address(newAddress) {
    if (!newAddress) {
      throw new DomainValidationError('profile.address', 'Cannot set address to null or undefined');
    }

    this._address = newAddress;
    this._modificationTime = new Date();
  }

  get address() {
    return this._address;
  }

  get modificationTime() {
    return this._modificationTime;
  }

  assignRole(role: Role, actor: UserId) {
    this.roleAssignments.addAssignment(role, this, actor);
  }

  removeRole(role: Role, actor: UserId) {
    this.roleAssignments.removeAssignment(role, this, actor);
  }

  get roles(): string[] {
    return this.roleAssignments.activeAssignments().map((role) => role.name);
  }

  get permissions(): string[] {
    const permissions: Set<string> = new Set();

    this.roleAssignments.activeAssignments().forEach((role) => {
      role
        .permissions()
        .map((permission) => permission.name)
        .forEach((permissionName) => permissions.add(permissionName));
    });

    return Array.from(permissions);
  }

  get hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }
}
