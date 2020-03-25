import knex from 'knex';
import { MagicLinkRepository } from '../../domain/model/magiclink/MagicLinkRepository';
import { MagicLink } from '../../domain/model/magiclink/MagicLink';
import { Email } from '../../domain/model/user/Email';

export class PsqlMagicLinkRepository implements MagicLinkRepository {
  constructor(private db: knex) {}

  async findByCode(code: string) {
    const linkRow: any = await this.db('magic_link')
      .select([
        'id',
        'email',
        'code',
        'active',
        'creation_time as creationTime',
      ])
      .where('code', '=', code)
      .first();

    if (!linkRow) {
      return null;
    }
    return new MagicLink(
      linkRow.id,
      new Email(linkRow.email),
      linkRow.code,
      linkRow.active,
      linkRow.creationTime
    );
  }

  async save(magicLink: MagicLink) {
    return await this.db
      .raw(
        `
      insert into magic_link (id, email, code, active, creation_time)
      values (:id, :email, :code, :active, :creation_time)
      on conflict(id) do update
      set active = excluded.active
    `,
        {
          id: magicLink.id,
          email: magicLink.email.value(),
          code: magicLink.code,
          active: magicLink.active,
          creation_time: magicLink.creationTime,
        }
      )
      .then(() => {
        return magicLink;
      });
  }
}
