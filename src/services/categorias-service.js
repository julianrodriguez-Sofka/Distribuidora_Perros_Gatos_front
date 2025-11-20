import apiClient from './api-client';

export const categoriasService = {
  // Get all categories
  async getAllCategories() {
    const response = await apiClient.get('/categorias');
    return response.data;
  },

  // Admin: Create category
  async createCategory(categoryData) {
    const response = await apiClient.post('/admin/categorias', categoryData);
    return response.data;
  },

  // Admin: Update category
  async updateCategory(id, categoryData) {
    const response = await apiClient.patch(`/admin/categorias/${id}`, categoryData);
    return response.data;
  },

  // Admin: Reorder categories
  async reorderCategories(reorderData) {
    const response = await apiClient.patch('/admin/categorias/reorder', reorderData);
    return response.data;
  },
};

