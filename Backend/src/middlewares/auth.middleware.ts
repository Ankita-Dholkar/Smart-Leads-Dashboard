import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import { IUserPayload } from '../types/auth.types';

const protect = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Not authorized. No token provided.', 401));
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new AppError('Server configuration error.', 500));
  }

  try {
    const decoded = jwt.verify(token, secret) as IUserPayload;
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Not authorized. Token is invalid or expired.', 401));
  }
};

export default protect;
