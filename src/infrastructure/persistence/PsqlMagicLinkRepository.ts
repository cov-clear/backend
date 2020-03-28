import knex from 'knex';
import { MagicLinkRepository } from '../../domain/model/magiclink/MagicLinkRepository';
import {
  MagicLink,
  MagicLinkCode,
} from '../../domain/model/magiclink/MagicLink';
import { Email } from '../../domain/model/user/Email';

export class PsqlMagicLinkRepository implements MagicLinkRepository {
  constructor(private db: knex) {}

  async findByCode(code: MagicLinkCode) {
    const linkRow: any = await this.db('magic_link')
      .select(['email', 'code', 'active', 'creation_time as creationTime'])
      .where('code', '=', code.value)
      .first();

    if (!linkRow) {
      return null;
    }
    return new MagicLink(
      new MagicLinkCode(linkRow.code),
      new Email(linkRow.email),
      linkRow.active,
      linkRow.creationTime
    );
  }

  async save(magicLink: MagicLink) {
    return await this.db
      .raw(
        `
      insert into magic_link (code, email, active, creation_time)
      values (:code, :email, :active, :creation_time)
      on conflict(code) do update
      set active = excluded.active
    `,
        {
          email: magicLink.email.value,
          code: magicLink.code.value,
          active: magicLink.active,
          creation_time: magicLink.creationTime,
        }
      )
      .then(() => {
        return magicLink;
      });
  }
}
