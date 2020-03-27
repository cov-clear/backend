import knex from 'knex';
import { SharingCodeRepository } from '../../domain/model/sharingCode/SharingCodeRepository';
import { SharingCode } from '../../domain/model/sharingCode/SharingCode';
import { UserId } from '../../domain/model/user/UserId';

export class PsqlSharingCodeRepository implements SharingCodeRepository {
  constructor(private db: knex) {}

  async findByCode(code: string) {
    const linkRow: any = await this.db('sharing_code')
      .select(['code', 'user_id as userId', 'creation_time as creationTime'])
      .where('code', '=', code)
      .first();

    if (!linkRow) {
      return null;
    }
    return new SharingCode(
      linkRow.code,
      new UserId(linkRow.userId),
      linkRow.creationTime
    );
  }

  async save(sharingCode: SharingCode) {
    return await this.db
      .raw(
        `
      insert into sharing_code (code, user_id, creation_time)
      values (:code, :user_id, :creation_time)
    `,
        {
          code: sharingCode.code,
          user_id: sharingCode.userId.value,
          creation_time: sharingCode.creationTime,
        }
      )
      .then(() => {
        return sharingCode;
      });
  }
}
