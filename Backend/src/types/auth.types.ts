export type UserRole = 'Admin' | 'Sales User';

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}
