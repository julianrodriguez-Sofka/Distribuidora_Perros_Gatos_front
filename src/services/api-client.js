import axios from 'axios';
import store from '../redux/store';
import { logout as logoutAction } from '../redux/actions/auth-actions';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies HTTP-only
});

// Request interceptor - Agregar token si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si hay un token en localStorage, probablemente el token expiró o es inválido:
      // en ese caso redirigimos a login. Si no hay token (petición pública),
      // no forzamos la redirección para permitir páginas públicas (ej. verification-code).
      const token = localStorage.getItem('access_token');
      if (token) {
        // Dispatch redux logout so the app can react (clear state, navigate, etc.)
        try {
          store.dispatch(logoutAction());
        } catch (e) {
          // Fallback to direct redirect if store dispatch fails
          if (window.location.pathname !== '/login') window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

