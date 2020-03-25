import knex from 'knex';
import { MagicLinkRepository } from '../../domain/model/magiclink/MagicLinkRepository';
import { MagicLink } from '../../domain/model/magiclink/MagicLink';
import { Email } from '../../domain/model/user/Email';

export class PsqlMagicLinkRepository implements MagicLinkRepository {
  constructor(private db: knex) {}

  async findByCode(code: string): Promise<MagicLink | undefined> {
    const magicLinkRow = await this.db('magic_link')
      .where('code', '=', code)
      .select([
        'id',
        'email',
        'code',
        'active',
        'creation_time as creationTime',
      ])
      .first();
    if (!magicLinkRow) {
      return undefined;
    }
    // @ts-ignore
    return new MagicLink(
      magicLinkRow.id,
      new Email(magicLinkRow.email),
      magicLinkRow.code,
      magicLinkRow.active,
      magicLinkRow.creationTime
    );
  }

  async save(magicLink: MagicLink) {
    await this.db.raw(
      `
      insert into magic_link (id, email, code, active, creation_time)
      values (:id, :email, :code, :active, :creation_time)
      on conflict(id) do update
      set active = excluded.active
    `,
      {
        id: magicLink.id,
        email: magicLink.email.value,
        code: magicLink.code,
        active: magicLink.active,
        creation_time: magicLink.creationTime,
      }
    );
    return magicLink;
  }
}
