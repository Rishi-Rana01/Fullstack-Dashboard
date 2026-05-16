// ── Backend User Types ─────────────────────────────────────────────────────
// All user/auth-related TypeScript types used across backend controllers,
// models, and middleware.

export type UserRole = 'admin' | 'sales';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// AuthResponse excludes the password field from user data
export interface AuthResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}
