import axiosInstance from './axios.instance';
import { AuthUser, LoginFormData, RegisterFormData } from '../types/auth.types';

// ── Auth API response shape ─────────────────────────────────────────────────
interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

interface MeApiResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

/**
 * POST /auth/register
 * Creates a new user account and returns a JWT + user object.
 */
export const registerApi = async (
  data: RegisterFormData
): Promise<AuthApiResponse['data']> => {
  const response = await axiosInstance.post<AuthApiResponse>('/auth/register', data);
  return response.data.data;
};

/**
 * POST /auth/login
 * Authenticates an existing user and returns a JWT + user object.
 */
export const loginApi = async (
  data: LoginFormData
): Promise<AuthApiResponse['data']> => {
  const response = await axiosInstance.post<AuthApiResponse>('/auth/login', data);
  return response.data.data;
};

/**
 * GET /auth/me
 * Returns the currently authenticated user's profile using the stored JWT.
 */
export const getMeApi = async (): Promise<AuthUser> => {
  const response = await axiosInstance.get<MeApiResponse>('/auth/me');
  return response.data.data;
};
