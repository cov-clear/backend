import knex from 'knex';
import { UserRepository } from '../../domain/model/user/UserRepository';
import { Email } from '../../domain/model/user/Email';
import { User } from '../../domain/model/user/User';
import { UserId } from '../../domain/model/user/UserId';
import { Address } from '../../domain/model/user/Address';
import { Profile } from '../../domain/model/user/Profile';
import { Sex } from '../../domain/model/user/Sex';
import database from '../../database';
import { Country } from '../../domain/model/user/Country';
import { DateOfBirth } from '../../domain/model/user/DateOfBirth';
import { RoleAssignmentAction } from '../../domain/model/authentication/RoleAssignmentAction';
import { createRoleWithAssignedPermissions } from './PsqlRoleRepository';
import { AssignmentId } from '../../domain/model/authentication/AssignmentAction';
import { AssignmentActionType } from '../../domain/model/authentication/AssignmentActionType';
import { Role } from '../../domain/model/authentication/Role';

const USER_TABLE_NAME = 'user';

const USER_TABLE_COLUMNS = [
  'id',
  'email',
  'profile',
  'address',
  'modification_time as modificationTime',
  'creation_time as creationTime',
];

export class PsqlUserRepository implements UserRepository {
  constructor(private db: knex) {}

  async save(user: User): Promise<User> {
    await this.db.raw(
      `insert into "${USER_TABLE_NAME}" (id, email, creation_time, modification_time)
        values (:id, :email, :creationTime, :modificationTime)
        on conflict do nothing`,
      {
        id: user.id.value,
        email: user.email.value,
        creationTime: user.creationTime,
        modificationTime: user.modificationTime,
      }
    );
    if (user.profile || user.address) {
      await database('user')
        .where({ id: user.id.value })
        .update({
          profile: JSON.stringify(toDbProfile(user.profile)),
          address: JSON.stringify(toDbAddress(user.address)),
          modification_time: user.modificationTime,
        });
    }
    await this.saveUserRoleAssignments(user);
    return user;
  }

  private async saveUserRoleAssignments(user: User) {
    await Promise.all(
      user.roleAssignments.newAssignmentActions.map(
        this.saveRoleAssignment.bind(this)
      )
    );
    Reflect.set(user.roleAssignments, 'newAssignmentActions', []);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userRow: any = await this.db(USER_TABLE_NAME)
      .where('email', '=', email.value)
      .select(USER_TABLE_COLUMNS)
      .first();

    if (!userRow) {
      return null;
    }
    return this.extractUserAndPopulateRoles(userRow);
  }

  async findByUserId(userId: UserId): Promise<User | null> {
    const userRow: any = await this.db(USER_TABLE_NAME)
      .where('id', '=', userId.value)
      .select(USER_TABLE_COLUMNS)
      .first();

    if (!userRow) {
      return null;
    }
    return this.extractUserAndPopulateRoles(userRow);
  }

  private async saveRoleAssignment(roleAssignment: RoleAssignmentAction) {
    await this.db('role_to_user_assignment').insert({
      id: roleAssignment.id.value,
      user_id: roleAssignment.assignedTo.id.value,
      role_name: roleAssignment.assignedResource.name,
      actor: roleAssignment.actor.value,
      creation_time: roleAssignment.creationTime,
      order: roleAssignment.order,
      action_type: roleAssignment.actionType.toString(),
    });
  }

  private async extractUserAndPopulateRoles(userRow: any) {
    const user = new User(
      new UserId(userRow.id),
      new Email(userRow.email),
      fromDbProfile(userRow.profile as DbProfile | undefined),
      fromDbAddress(userRow.address as DbAddress | undefined),
      userRow.creationTime,
      userRow.modificationTime
    );
    const roleAssignmentActions = await this.getRoleAssignments(user);
    Reflect.set(
      user.roleAssignments,
      'assignmentActions',
      roleAssignmentActions
    );
    Reflect.set(user.roleAssignments, 'newAssignmentActions', []);
    return user;
  }

  private async getRoleAssignments(
    user: User
  ): Promise<RoleAssignmentAction[]> {
    const roleAssignmentRows: any[] = await this.db(
      'role_to_user_assignment as rua'
    )
      .select([
        'rua.id as ruaId',
        'rua.creation_time as ruaCreationTime',
        'rua.action_type as ruaActionType',
        'rua.actor as ruaActor',
        'rua.order as ruaOrder',
        'r.name as roleName',
        'r.creation_time as roleCreationTime',
        'pra.id as praId',
        'pra.creation_time as praCreationTime',
        'pra.action_type as praActionType',
        'pra.actor as praActor',
        'pra.order as praOrder',
        'p.name as permissionName',
        'p.creation_time as permissionCreationTime',
      ])
      .leftJoin('role as r', 'r.name', 'rua.role_name')
      .leftJoin(
        'permission_to_role_assignment as pra',
        'r.name',
        'pra.role_name'
      )
      .leftJoin('permission as p', 'pra.permission_name', 'p.name')
      .where('rua.user_id', '=', user.id.value);

    const groupedByAssignmentId = this.groupByAssignmentId(roleAssignmentRows);
    return this.mapToRoleAssignmentActions(groupedByAssignmentId, user);
  }

  private groupByAssignmentId(roleAssignmentRows: any[]) {
    const groupedByAssignmentId = new Map<string, any[]>();
    roleAssignmentRows
      .filter((row) => row.roleName && row.roleCreationTime)
      .forEach((row) => {
        const rowsForKey = groupedByAssignmentId.get(row.ruaId);
        rowsForKey
          ? rowsForKey.push(row)
          : groupedByAssignmentId.set(row.ruaId, [row]);
      });
    return groupedByAssignmentId;
  }

  private mapToRoleAssignmentActions(
    groupedByAssignmentId: Map<string, any[]>,
    user: User
  ) {
    const roleAssignmentActions: RoleAssignmentAction[] = [];
    groupedByAssignmentId.forEach((roleRows) => {
      const role = createRoleWithAssignedPermissions(roleRows);
      roleAssignmentActions.push(
        this.createRoleAssignmentAction(roleRows[0], user, role)
      );
    });
    return roleAssignmentActions;
  }

  private createRoleAssignmentAction(
    roleAssignmentRow: any,
    user: User,
    role: Role
  ) {
    return new RoleAssignmentAction(
      new AssignmentId(roleAssignmentRow.ruaId),
      user,
      role,
      roleAssignmentRow.ruaActionType === 'ADD'
        ? AssignmentActionType.ADD
        : AssignmentActionType.REMOVE,
      new UserId(roleAssignmentRow.ruaActor),
      roleAssignmentRow.ruaOrder,
      roleAssignmentRow.ruaCreationTime
    );
  }
}

function toDbProfile(profile?: Profile): DbProfile | undefined {
  return profile
    ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth.toString(),
        sex: profile.sex,
      }
    : undefined;
}

function toDbAddress(address?: Address): DbAddress | undefined {
  return address
    ? {
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        region: address.region,
        postcode: address.postcode,
        countryCode: address.country.code,
      }
    : undefined;
}

function fromDbProfile(dbProfile?: DbProfile): Profile | undefined {
  return dbProfile
    ? new Profile(
        dbProfile.firstName,
        dbProfile.lastName,
        DateOfBirth.fromString(dbProfile.dateOfBirth),
        dbProfile.sex === Sex.MALE ? Sex.MALE : Sex.FEMALE
      )
    : undefined;
}

function fromDbAddress(dbAddress?: DbAddress): Address | undefined {
  return dbAddress
    ? new Address(
        dbAddress.address1,
        dbAddress.address2,
        dbAddress.city,
        dbAddress.region,
        dbAddress.postcode,
        new Country(dbAddress.countryCode)
      )
    : undefined;
}

interface DbAddress {
  address1: string;
  address2?: string;
  city: string;
  region: string;
  postcode: string;
  countryCode: string;
}

interface DbProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
}
