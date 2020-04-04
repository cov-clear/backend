import { Response, Router } from 'express';
import { Service } from 'typedi';

import AsyncRouter from '../../api/AsyncRouter';
import { ApiController } from './ApiController';
import { isAuthenticated } from '../../api/middleware/isAuthenticated';
import { AuthenticatedRequest } from '../../api/AuthenticatedRequest';

import { BulkCreateUsers } from '../../application/service/users/BulkCreateUsers';
import { CreateUserCommand } from '../commands/users';
import { UserTransformer } from '../transformers/users';

@Service()
export class AdminController implements ApiController {
  constructor(private bulkCreateUsersService: BulkCreateUsers, private userTransformer: UserTransformer) {}

  public routes(): Router {
    const route = new AsyncRouter();

    route.get('/users', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
      const command = req.body as CreateUserCommand[];
      const users = await this.bulkCreateUsersService.execute(command);

      res.status(200).json(users.map((u) => this.userTransformer.toUserDTO(u)));
    });

    return route.middleware();
  }
}
