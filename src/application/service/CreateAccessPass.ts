import { UserId } from '../../domain/model/user/UserId';
import { AccessPass } from '../../domain/model/accessPass/AccessPass';
import { AccessPassRepository } from '../../domain/model/accessPass/AccessPassRepository';

export class CreateAccessPass {
  constructor() {}

  public async withIdAndSharingCode(
    userId: string,
    code: string
  ): Promise<AccessPass> {
    const accessPass = new AccessPass(new UserId(userId), code);
    // TODO we need to set up permissions for this user somehow.
    return accessPass;
  }
}
