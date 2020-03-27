import { Request } from 'express';
import * as core from 'express-serve-static-core';
import { Authentication } from '../domain/model/authentication/Authentication';

export interface AuthenticatedRequest<
  P extends core.Params = core.ParamsDictionary
> extends Request<P> {
  authentication?: Authentication;
}
