import { User } from '../../../domain/model/user/User';
import { UserId } from '../../../domain/model/user/UserId';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import { AccessPassRepository } from '../../../domain/model/accessPass/AccessPassRepository';

export class GetAccessibleUsers {
  constructor(private userRepository: UserRepository, private accessPassRepository: AccessPassRepository) {}

  async byActorId(id: string): Promise<Array<User>> {
    const accessPasses = await this.accessPassRepository.findByActorId(new UserId(id));

    const userIds = accessPasses
      .filter((accessPass) => !accessPass.isExpired())
      .map((accessPass) => accessPass.subjectUserId);

    return this.userRepository.findByUserIds(userIds);
  }
}
