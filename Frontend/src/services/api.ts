import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'https://smart-leads-dashboard-h8no.onrender.com/api';
API_URL = API_URL.replace(/\/$/, ''); // Remove any trailing slash
if (!API_URL.endsWith('/api')) {
  API_URL += '/api';
}

const api = axios.create({
  baseURL: API_URL,
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
