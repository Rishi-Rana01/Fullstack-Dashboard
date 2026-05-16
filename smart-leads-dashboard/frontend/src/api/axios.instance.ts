import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ── Axios Instance ──────────────────────────────────────────────────────────
// Single configured instance used by all API modules.
// baseURL is read from Vite's import.meta.env (never hardcoded).

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

if (!API_BASE_URL) {
  console.error('VITE_API_URL environment variable is not defined');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ─────────────────────────────────────────────────────
// Attach the JWT from localStorage to every outgoing request as a Bearer token.
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────────────────
// On a 401 response, clear the stale auth state and redirect to login.
// This handles expired or revoked tokens transparently.
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear all auth-related localStorage keys
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on the login page (avoids redirect loop)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Normalize error message for consistent handling in components/hooks
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;
    const normalizedError = new Error(
      responseData?.message ?? error.message ?? 'An unexpected error occurred.'
    );

    return Promise.reject(normalizedError);
  }
);

export default axiosInstance;
