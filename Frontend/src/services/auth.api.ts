import api from './api';
import type { AuthResponse, LoginFormData, RegisterFormData } from '../types/auth.types';

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const res = await api.post<{ data: AuthResponse }>('/auth/login', data);
  return res.data.data;
};

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  const res = await api.post<{ data: AuthResponse }>('/auth/register', data);
  return res.data.data;
};

export const getMe = async (): Promise<AuthResponse['user']> => {
  const res = await api.get<{ data: AuthResponse['user'] }>('/auth/me');
  return res.data.data;
};
