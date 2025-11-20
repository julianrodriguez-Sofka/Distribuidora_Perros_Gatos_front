import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies HTTP-only
});

// Request interceptor - Agregar token si existe
apiClient.interceptors.request.use(
  (config) => {
    // El token se maneja mediante cookies HTTP-only según la arquitectura
    // No necesitamos agregar Authorization header manualmente
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      // Redirigir a login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

