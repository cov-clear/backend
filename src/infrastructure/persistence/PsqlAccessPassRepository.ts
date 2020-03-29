import knex from 'knex';
import { AccessPassRepository } from '../../domain/model/magiclink/AccessPassRepository';
import { AccessPass } from '../../domain/model/magiclink/AccessPass';
import { UserId } from '../../domain/model/user/UserId';

export class PsqlAccessPassRepository implements AccessPassRepository {
  constructor(private db: knex) {}

  async findByUserIds(actorUserId: string, subjectUserId: string) {
    const linkRow: any = await this.db('access_pass')
      .select([
        'id',
        'actor_id as actorUserId',
        'subject_id as subjectUserId',
        'creation_time as creationTime',
      ])
      .where({
        actor_user_id: actorUserId,
        subject_user_id: subjectUserId,
      })
      .orderBy('creation_time', 'desc') // TODO is this the right way around :-s
      .first();

    if (!linkRow) {
      return null;
    }
    return new AccessPass(
      new UserId(linkRow.actorUserId),
      new UserId(linkRow.subjectUserId),
      linkRow.id,
      linkRow.creationTime
    );
  }

  async save(accessPass: AccessPass) {
    return await this.db
      .raw(
        `
      insert into access_pass (id, actor_user_id, subject_user_id, creation_time)
      values (:id, :email, :code, :active, :creation_time)
      on conflict do nothing
    `,
        // TODO something smarter on conflict?
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
