import { validationResult } from 'express-validator';
import { Request } from 'express';
import User, { IUser } from '../models/User.model';
import generateToken from '../utils/generateToken';
import AppError from '../utils/AppError';
import { AuthResponse, RegisterRequestBody, LoginRequestBody } from '../types/auth.types';

/**
 * Checks validation results from express-validator and throws on failure.
 */
export const checkValidation = (req: Request): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg as string)
      .join(', ');
    throw new AppError(message, 400);
  }
};

export const registerUser = async (
  body: RegisterRequestBody
): Promise<AuthResponse> => {
  const { name, email, password, role = 'Sales User' } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  // Enforce unique Admin account
  if (role === 'Admin') {
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      throw new AppError('An Admin account already exists. Only one Admin is allowed in the system.', 403);
    }
  }

  const user = await User.create({ name, email, password, role });
  const userId = user._id.toString();

  const token = generateToken({ id: userId, email: user.email, role: user.role });

  return {
    token,
    user: { id: userId, name: user.name, email: user.email, role: user.role },
  };
};

export const loginUser = async (
  body: LoginRequestBody
): Promise<AuthResponse> => {
  const { email, password } = body;

  // Explicitly select password since it's excluded by default
  const user: IUser | null = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const userId = user._id.toString();
  const token = generateToken({ id: userId, email: user.email, role: user.role });

  return {
    token,
    user: { id: userId, name: user.name, email: user.email, role: user.role },
  };
};

export const getMe = async (userId: string): Promise<Omit<IUser, 'password'>> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};
