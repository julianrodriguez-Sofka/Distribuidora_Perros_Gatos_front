import apiClient from './api-client';

export const authService = {
  // Login
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Register
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Verify email
  async verifyEmail(email, code) {
    const response = await apiClient.post('/auth/verify-email', { email, code });
    return response.data;
  },

  // Logout
  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

