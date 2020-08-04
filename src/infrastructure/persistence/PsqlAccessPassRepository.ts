import knex from 'knex';
import { AccessPassRepository } from '../../domain/model/accessPass/AccessPassRepository';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { UserId } from '../../domain/model/user/UserId';
import { countRowsInTable } from './utils';

const ACCESS_PASS_TABLE_NAME = 'access_pass';

export class PsqlAccessPassRepository implements AccessPassRepository {
  constructor(private db: knex) {}

  async getTotalAmountOfAccessPasses(): Promise<number> {
    return countRowsInTable(this.db, ACCESS_PASS_TABLE_NAME);
  }

  async findByUserIds(actorUserId: UserId, subjectUserId: UserId) {
    const linkRow: any = await this.db(ACCESS_PASS_TABLE_NAME)
      .select([
        'id',
        'actor_user_id as actorUserId',
        'subject_user_id as subjectUserId',
        'duration',
        'creation_time as creationTime',
      ])
      .where({
        actor_user_id: actorUserId.value,
        subject_user_id: subjectUserId.value,
      })
      .orderBy('creation_time', 'desc')
      .first();

    if (!linkRow) {
      return null;
    }

    return new AccessPass(
      new UserId(linkRow.actorUserId),
      new UserId(linkRow.subjectUserId),
      linkRow.duration,
      linkRow.id,
      linkRow.creationTime
    );
  }

  async save(accessPass: AccessPass) {
    return await this.db
      .raw(
        `
      insert into "${ACCESS_PASS_TABLE_NAME}" (id, actor_user_id, subject_user_id, duration, creation_time)
      values (:id, :actor_user_id, :subject_user_id, :duration, :creation_time)
    `,
        {
          id: accessPass.id,
          actor_user_id: accessPass.actorUserId.value,
          subject_user_id: accessPass.subjectUserId.value,
          duration: accessPass.duration,
          creation_time: accessPass.creationTime,
        }
      )
      .then(() => {
        return accessPass;
      });
  }
}
