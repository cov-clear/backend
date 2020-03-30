import knex from 'knex';
import { AccessPassRepository } from '../../domain/model/accessPass/AccessPassRepository';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { UserId } from '../../domain/model/user/UserId';

const ACCESS_PASS_TABLE_NAME = 'access_pass';

export class PsqlAccessPassRepository implements AccessPassRepository {
  constructor(private db: knex) {}

  async findByUserIds(actorUserId: UserId, subjectUserId: UserId) {
    const linkRows: any = await this.db(ACCESS_PASS_TABLE_NAME)
      .select(['id', 'actor_user_id', 'subject_user_id', 'creation_time'])
      .where({
        actor_user_id: actorUserId.value,
        subject_user_id: subjectUserId.value,
      })
      .orderBy('creation_time', 'desc');

    if (!linkRows || linkRows.length === 0) {
      return null;
    }

    const [linkRow] = linkRows;

    return new AccessPass(
      new UserId(linkRow.actor_user_id),
      new UserId(linkRow.subject_user_id),
      linkRow.id,
      linkRow.creation_time
    );
  }

  async save(accessPass: AccessPass) {
    return await this.db
      .raw(
        `
      insert into "${ACCESS_PASS_TABLE_NAME}" (id, actor_user_id, subject_user_id, creation_time)
      values (:id, :actor_user_id, :subject_user_id, :creation_time)
    `,
        {
          id: accessPass.id,
          actor_user_id: accessPass.actorUserId.value,
          subject_user_id: accessPass.subjectUserId.value,
          creation_time: accessPass.creationTime,
        }
      )
      .then(() => {
        return accessPass;
      });
  }
}
