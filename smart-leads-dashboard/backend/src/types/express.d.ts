// ── Express Request Augmentation ───────────────────────────────────────────


import { UserRole } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email: string;
      };
    }
  }
}

export {};
