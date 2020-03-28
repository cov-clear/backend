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
        values (:id, :email, :creation_time, :modification_time)
        on conflict do nothing`,
      {
        id: user.id.value,
        email: user.email.value,
        creation_time: user.creationTime,
        modification_time: user.modificationTime,
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
        'rua.id as rua_id',
        'rua.creation_time as rua_creation_time',
        'rua.action_type as rua_action_type',
        'rua.actor as rua_actor',
        'rua.order as rua_order',
        'r.name as role_name',
        'r.creation_time as role_creation_time',
        'pra.id as pra_id',
        'pra.creation_time as pra_creation_time',
        'pra.action_type as pra_action_type',
        'pra.actor as pra_actor',
        'pra.order as pra_order',
        'p.name as permission_name',
        'p.creation_time as permission_creation_time',
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
      .filter((row) => row.role_name && row.role_creation_time)
      .forEach((row) => {
        const rowsForKey = groupedByAssignmentId.get(row.rua_id);
        rowsForKey
          ? rowsForKey.push(row)
          : groupedByAssignmentId.set(row.rua_id, [row]);
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
        new RoleAssignmentAction(
          new AssignmentId(roleRows[0].rua_id),
          user,
          role,
          roleRows[0].rua_action_type === 'ADD'
            ? AssignmentActionType.ADD
            : AssignmentActionType.REMOVE,
          new UserId(roleRows[0].rua_actor),
          roleRows[0].rua_order,
          roleRows[0].rua_creation_time
        )
      );
    });
    return roleAssignmentActions;
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
