import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';
import { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  /** Optional: restrict to specific roles. If omitted, any authenticated user is allowed. */
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * - Shows a full-page spinner during the initial auth check (token validation).
 * - Redirects to /login if the user is not authenticated.
 * - Redirects to /dashboard with a 403-like behavior if the role is not permitted.
 * - Renders <Outlet /> for nested routes when access is granted.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show spinner while the auth context validates the stored token
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if the user doesn't have the required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and authorized — render the child route
  return <Outlet />;
};
