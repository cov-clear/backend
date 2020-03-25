import { User } from '../../domain/model/user/User';
import * as config from '../../config';
import jwt from 'jsonwebtoken';

export class GenerateAuthToken {
  private jwtTimeToLiveInMs: number;

  constructor(private jwtSecret: string, jwtTimeToLiveInDays: number) {
    this.jwtTimeToLiveInMs = jwtTimeToLiveInDays * 24 * 60 * 60_000;
  }

  public async execute(user: User) {
    return jwt.sign(
      {
        userId: user.id(),
        userEmail: user.email(),
        roles: [],
        expiration: new Date(Date.now() + this.jwtTimeToLiveInMs),
      },
      this.jwtSecret
    );
  }
}

export default new GenerateAuthToken(
  config.get('jwt.secret'),
  config.get('jwt.timeToLiveInDays')
);
