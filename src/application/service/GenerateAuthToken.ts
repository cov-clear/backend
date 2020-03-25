import { User } from '../../domain/model/user/User';
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