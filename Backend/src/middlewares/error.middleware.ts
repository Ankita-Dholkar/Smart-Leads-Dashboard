import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import AppError from '../utils/AppError';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: Record<string, string> | undefined;

  // Operational errors (thrown by us)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose Validation Error
  else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, val.message])
    );
  }

  // Mongoose Duplicate Key Error
  else if ((err as MongoError).code === 11000) {
    const mongoErr = err as MongoError;
    const field = Object.keys(mongoErr.keyValue ?? {})[0] ?? 'field';
    statusCode = 409;
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // JWT Errors
  else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token has expired. Please login again.';
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
  }

  // Mongoose CastError (invalid ObjectId)
  else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Development: include stack trace
  const isDev = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDev && { stack: err.stack }),
  });
};

export default errorMiddleware;
