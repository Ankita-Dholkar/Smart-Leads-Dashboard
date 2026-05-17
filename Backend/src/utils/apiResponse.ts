import { Response } from 'express';

interface ApiResponseOptions<T> {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

/**
 * Sends a consistent, typed JSON response structure across all endpoints.
 */
export const sendResponse = <T>({
  res,
  statusCode,
  success,
  message,
  data,
  meta,
}: ApiResponseOptions<T>): void => {
  res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};
