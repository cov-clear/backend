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
    return user;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userRow: any = await this.db(USER_TABLE_NAME)
      .where('email', '=', email.value)
      .select(USER_TABLE_COLUMNS)
      .first();

    if (!userRow) {
      return null;
    }
    return extractUser(userRow);
  }

  async findByUserId(userId: UserId): Promise<User | null> {
    const userRow: any = await this.db(USER_TABLE_NAME)
      .where('id', '=', userId.value)
      .select(USER_TABLE_COLUMNS)
      .first();

    if (!userRow) {
      return null;
    }
    return extractUser(userRow);
  }
}

function extractUser(userRow: any) {
  return new User(
    new UserId(userRow.id),
    new Email(userRow.email),
    fromDbProfile(userRow.profile as DbProfile | undefined),
    fromDbAddress(userRow.address as DbAddress | undefined),
    userRow.creationTime,
    userRow.modificationTime
  );
}

function toDbProfile(profile?: Profile): DbProfile | undefined {
  return profile
    ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
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
    ? {
        firstName: dbProfile.firstName,
        lastName: dbProfile.lastName,
        sex: dbProfile.sex === Sex.MALE ? Sex.MALE : Sex.FEMALE,
        dateOfBirth: dbProfile.dateOfBirth,
      }
    : undefined;
}

function fromDbAddress(dbAddress?: DbAddress): Address | undefined {
  return dbAddress
    ? {
        address1: dbAddress.address1,
        address2: dbAddress.address2,
        country: new Country(dbAddress.countryCode),
        postcode: dbAddress.postcode,
        city: dbAddress.city,
        region: dbAddress.region,
      }
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
