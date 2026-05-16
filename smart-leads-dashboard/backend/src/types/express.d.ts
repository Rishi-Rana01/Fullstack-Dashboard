// ── Express Request Augmentation ───────────────────────────────────────────
// Extends the Express Request interface to include the authenticated user
// payload after JWT verification in auth.middleware.ts.
// This declaration file is automatically picked up by TypeScript.

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

// Make this a module to avoid "cannot redeclare block-scoped variable" errors
export {};
