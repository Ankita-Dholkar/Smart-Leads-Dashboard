import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

type AsyncController<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Any thrown error is forwarded to Express's centralized error handler.
 */
const asyncHandler =
  <P = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = ParsedQs>(
    fn: AsyncController<P, ResBody, ReqBody, ReqQuery>
  ) =>
  (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
