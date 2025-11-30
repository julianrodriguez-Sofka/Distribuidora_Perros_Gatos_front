import apiClient from './api-client';

export const usuariosService = {
  // Admin: Get all users
  async getAllUsers() {
    const response = await apiClient.get('/admin/usuarios');
    return response.data;
  },

  // Admin: Get user by id
  async getUserById(id) {
    const response = await apiClient.get(`/admin/usuarios/${id}`);
    return response.data;
  },

  // Admin: Search users
  async searchUsers(query) {
    const response = await apiClient.get('/admin/usuarios/search', {
      params: { q: query },
    });
    return response.data;
  },

  // Admin: Get user orders
  async getUserOrders(userId) {
    const response = await apiClient.get(`/admin/usuarios/${userId}/pedidos`);
    return response.data;
  },
};

