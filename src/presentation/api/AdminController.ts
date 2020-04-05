import { Response, Router } from 'express';

import AsyncRouter from '../../api/AsyncRouter';
import { ApiController } from './ApiController';
import { isAuthenticated } from '../../api/middleware/isAuthenticated';
import { AuthenticatedRequest } from '../../api/AuthenticatedRequest';

import { bulkCreateUsers } from '../../application/service/index';
import { CreateUserCommand } from '../commands/users';
import { UserTransformer } from '../transformers/users';
import { hasPermission } from '../../api/middleware/hasPermission';
import { BULK_CREATE_USERS } from '../../domain/model/authentication/Permissions';

export class AdminController implements ApiController {
  public routes(): Router {
    const route = new AsyncRouter();

    route.post('/users', hasPermission(BULK_CREATE_USERS), async (req: AuthenticatedRequest, res: Response) => {
      const command = req.body as CreateUserCommand[];
      const users = await bulkCreateUsers.execute(command);

      res.status(200).json(users.map((u) => new UserTransformer().toUserDTO(u)));
    });

    return route.middleware();
  }
}
