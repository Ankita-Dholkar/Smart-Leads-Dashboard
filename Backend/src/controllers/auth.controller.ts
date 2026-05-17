import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import asyncHandler from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import * as authService from '../services/auth.service';
import { RegisterRequestBody, LoginRequestBody } from '../types/auth.types';

export const register = asyncHandler<ParamsDictionary, unknown, RegisterRequestBody>(
  async (req: Request<ParamsDictionary, unknown, RegisterRequestBody>, res: Response): Promise<void> => {
    authService.checkValidation(req);
    const result = await authService.registerUser(req.body);
    sendResponse({ res, statusCode: 201, success: true, message: 'Registration successful.', data: result });
  }
);

export const login = asyncHandler<ParamsDictionary, unknown, LoginRequestBody>(
  async (req: Request<ParamsDictionary, unknown, LoginRequestBody>, res: Response): Promise<void> => {
    authService.checkValidation(req);
    const result = await authService.loginUser(req.body);
    sendResponse({ res, statusCode: 200, success: true, message: 'Login successful.', data: result });
  }
);

export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const user = await authService.getMe(userId);
    sendResponse({ res, statusCode: 200, success: true, message: 'User fetched.', data: user });
  }
);
