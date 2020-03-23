import { Router, RequestHandler, Request, Response } from 'express';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: () => any
) => Promise<any>;

function wrapAsyncRoute(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: () => any) => {
    fn(req, res, next).catch(next);
  };
}

export default class AsyncRouter {
  private expressRouter: Router;

  constructor() {
    this.expressRouter = Router();
  }

  use(...middleware: RequestHandler[]): AsyncRouter {
    this.expressRouter.use(...middleware);
    return this;
  }

  get(path: string, handler: AsyncRouteHandler): AsyncRouter {
    this.expressRouter.get(path, wrapAsyncRoute(handler));
    return this;
  }

  post(path: string, handler: AsyncRouteHandler): AsyncRouter {
    this.expressRouter.post(path, wrapAsyncRoute(handler));
    return this;
  }

  put(path: string, handler: AsyncRouteHandler): AsyncRouter {
    this.expressRouter.put(path, wrapAsyncRoute(handler));
    return this;
  }

  patch(path: string, handler: AsyncRouteHandler): AsyncRouter {
    this.expressRouter.patch(path, wrapAsyncRoute(handler));
    return this;
  }

  delete(path: string, handler: AsyncRouteHandler): AsyncRouter {
    this.expressRouter.delete(path, wrapAsyncRoute(handler));
    return this;
  }

  middleware(): Router {
    return this.expressRouter;
  }
}
