import { IUserPayload } from './auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

export {};
