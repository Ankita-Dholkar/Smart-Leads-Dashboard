import jwt from 'jsonwebtoken';
import { IUserPayload } from '../types/auth.types';

const generateToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export default generateToken;
