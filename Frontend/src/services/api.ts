import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smart-leads-dashboard-h8no.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler — auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Only redirect to login if the 401 is NOT from the login/register requests
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error as Error);
  }
);

export default api;
