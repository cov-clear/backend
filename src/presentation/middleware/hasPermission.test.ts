import { Request, Response } from 'express';
import { hasPermission } from './hasPermission';
import { ApiError, apiErrorCodes } from '../../api/ApiError';
import { Authentication } from '../../domain/model/authentication/Authentication';
import { aNewUser } from '../../test/domainFactories';
import { AuthenticatedRequest } from '../../api/AuthenticatedRequest';

describe('hasPermission middleware', () => {
  it('throws error if the caller is not authenticated', async () => {
    const request = {} as Request;
    const response = {} as Response;
    const next = jest.fn();
    await hasPermission('ANY_PERMISSION')(request, response, next);
    expect(next).toHaveBeenCalledWith(new ApiError(401, apiErrorCodes.UNAUTHORIZED_ACCESS));
  });

  it('throws error if the caller does not have the required permission', async () => {
    const authentication = new Authentication(aNewUser(), ['USER'], ['PERMISSION_ONE']);
    const requiredPermission = 'PERMISSION_TWO';
    const request = { authentication } as AuthenticatedRequest;
    const response = {} as Response;
    const next = jest.fn();
    await hasPermission(requiredPermission)(request, response, next);
    expect(next).toHaveBeenCalledWith(new ApiError(403, apiErrorCodes.ACCESS_DENIED));
  });

  it('allows the request through if the call has the required permission', async () => {
    const requiredPermission = 'PERMISSION_TWO';
    const authentication = new Authentication(aNewUser(), ['USER'], [requiredPermission]);
    const request = { authentication } as AuthenticatedRequest;
    const response = {} as Response;
    const next = jest.fn();

    await hasPermission(requiredPermission)(request, response, next);
    expect(next).toHaveBeenCalledWith();
  });
});
