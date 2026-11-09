import axios from 'axios';

const getBaseURL = () => {
  // If explicitly specified in environment (e.g. Vercel dashboard environment variables)
  let url = import.meta.env.VITE_API_URL;

  if (!url) {
    // In local development (npm run dev), use local backend
    if (import.meta.env.DEV) {
      url = 'http://localhost:5000/api/';
    } else {
      // In production builds (Vercel deployment), default to custom domain backend
      url = 'https://api.rootsip.com/api/';
    }
  }

  url = url.trim();
  if (!url.endsWith('/')) url += '/';
  if (!url.endsWith('/api/')) {
    url = url.replace(/\/+$/, '') + '/api/';
  }
  return url;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / redirection
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API.defaults.baseURL}auth/refresh`, {
            refresh: refreshToken,
          });
          if (res.status === 200) {
            localStorage.setItem('access_token', res.data.access);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          // Token refresh failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
