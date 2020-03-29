import { Request, RequestHandler, Response, Router } from 'express';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: () => any
) => Promise<any>;

export function wrapAsyncFunction(fn: AsyncRouteHandler) {
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

  get(path: string, ...handlers: Array<AsyncRouteHandler>): AsyncRouter {
    this.expressRouter.get(path, handlers.map(wrapAsyncFunction));
    return this;
  }

  post(path: string, ...handlers: Array<AsyncRouteHandler>): AsyncRouter {
    this.expressRouter.post(path, handlers.map(wrapAsyncFunction));
    return this;
  }

  put(path: string, ...handlers: Array<AsyncRouteHandler>): AsyncRouter {
    this.expressRouter.put(path, handlers.map(wrapAsyncFunction));
    return this;
  }

  patch(path: string, ...handlers: Array<AsyncRouteHandler>): AsyncRouter {
    this.expressRouter.patch(path, handlers.map(wrapAsyncFunction));
    return this;
  }

  delete(path: string, ...handlers: Array<AsyncRouteHandler>): AsyncRouter {
    this.expressRouter.delete(path, handlers.map(wrapAsyncFunction));
    return this;
  }

  middleware(): Router {
    return this.expressRouter;
  }
}
