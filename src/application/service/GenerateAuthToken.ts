import { User } from '../../domain/model/user/User';
import jwt from 'jsonwebtoken';

export class GenerateAuthToken {
  private jwtTimeToLiveInMs: number;

  constructor(private jwtSecret: string, jwtTimeToLiveInHours: number) {
    this.jwtTimeToLiveInMs = jwtTimeToLiveInHours * 60 * 60_000;
  }

  public async execute(user: User) {
    return jwt.sign(
      {
        userId: user.id.value,
        roles: [],
        expiration: new Date(Date.now() + this.jwtTimeToLiveInMs),
      },
      this.jwtSecret
    );
  }
}
