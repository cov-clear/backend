import knex from 'knex';
import { AccessPassRepository } from '../../domain/model/accessPass/AccessPassRepository';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { UserId } from '../../domain/model/user/UserId';

const ACCESS_PASS_TABLE_NAME = 'access_pass';

const COLUMNS = [
  'id',
  'actor_user_id as actorUserId',
  'subject_user_id as subjectUserId',
  'duration',
  'creation_time as creationTime',
];

export class PsqlAccessPassRepository implements AccessPassRepository {
  constructor(private db: knex) {}

  async findByUserIds(actorUserId: UserId, subjectUserId: UserId) {
    const linkRow: any = await this.db(ACCESS_PASS_TABLE_NAME)
      .select(COLUMNS)
      .where({
        actor_user_id: actorUserId.value,
        subject_user_id: subjectUserId.value,
      })
      .orderBy('creation_time', 'desc')
      .first();

    if (!linkRow) {
      return null;
    }

    return convertRowToAccessPass(linkRow);
  }

  async findByActorId(actorUserId: UserId) {
    // TODO group by userId to get latest, but also get latest duration, so can't just use MAX
    const rows: any = await this.db(ACCESS_PASS_TABLE_NAME)
      .select(COLUMNS)
      .where({
        actor_user_id: actorUserId.value,
      })
      .orderBy('creation_time', 'desc');

    if (!rows) {
      return [];
    }

    return rows.map(convertRowToAccessPass);
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

function convertRowToAccessPass(linkRow: any) {
  return new AccessPass(
    new UserId(linkRow.actorUserId),
    new UserId(linkRow.subjectUserId),
    linkRow.duration,
    linkRow.id,
    linkRow.creationTime
  );
}
