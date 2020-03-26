import knex from 'knex';
import { UserRepository } from '../../domain/model/user/UserRepository';
import { Email } from '../../domain/model/user/Email';
import { User } from '../../domain/model/user/User';
import { UserId } from '../../domain/model/user/UserId';

const USER_TABLE_NAME = 'user';

export class PsqlUserRepository implements UserRepository {
  constructor(private db: knex) {}

  async save(user: User): Promise<User> {
    return await this.db
      .raw(
        `
      insert into "${USER_TABLE_NAME}" (id, email, creation_time)
      values (:id, :email, :creation_time)
      on conflict do nothing
    `,
        {
          id: user.id().value(),
          email: user.email().value(),
          creation_time: user.creationTime(),
        }
      )
      .then(() => user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userRow: any = await this.db(USER_TABLE_NAME)
      .where('email', '=', email.value())
      .select(['id', 'email', 'creation_time as creationTime'])
      .first();

    if (!userRow) {
      return null;
    }
    return new User(
      new UserId(userRow.id),
      new Email(userRow.email),
      userRow.creationTime
    );
  }

  async findByUserId(userId: UserId): Promise<User | null> {
    const userRow: any = await this.db(USER_TABLE_NAME)
      .where('id', '=', userId.value())
      .select(['id', 'email', 'creation_time as creationTime'])
      .first();

    if (!userRow) {
      return null;
    }
    return new User(
      new UserId(userRow.id),
      new Email(userRow.email),
      userRow.creationTime
    );
  }
}
