import { Response } from 'express';
import { Service } from 'typedi';

import AsyncRouter from '../../api/AsyncRouter';
import { isAuthenticated } from '../../api/middleware/isAuthenticated';
import { AuthenticatedRequest } from '../../api/AuthenticatedRequest';
import { ApiError, apiErrorCodes } from '../../api/ApiError';

import { BulkCreateUsers } from '../../application/service/users/BulkCreateUsers';
import { CreateUserCommand } from '../../application/commands/users';
import { UserDTO } from '../dtos/users';
import { UserTransformer } from '../transformers/users';
import { User } from '../../domain/model/user/User';

@Service()
export class AdminController {
  constructor(private bulkCreateUsers: BulkCreateUsers, private userTransformer: UserTransformer) {}

  public routes() {
    const route = new AsyncRouter();

    route.get('/users', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
      const command = req.body as CreateUserCommand[];

      const users = await this.bulkCreateUsers.execute(command);

      res.status(200).json(users.map((u) => this.userTransformer.toUserDTO(u)));
    });

    return route.middleware();
  }
}
