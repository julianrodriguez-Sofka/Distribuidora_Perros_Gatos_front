import apiClient from './api-client';

export const categoriasService = {
  // Fetch all categories (admin listing)
  async getAll() {
    const response = await apiClient.get('/admin/categorias');
    return response.data;
  },

  // Create a top-level category (nombre: string)
  async createCategory(nombre) {
    const payload = { nombre: nombre.trim(), tipo: 'categoria' };
    const response = await apiClient.post('/admin/categorias', payload);
    return response.data;
  },

  // Create a subcategory under a parent category id
  async createSubcategory(categoriaPadreId, nombre) {
    // backend expects snake_case field names (categoria_id)
    const payload = { nombre: nombre.trim(), tipo: 'subcategoria', categoria_id: categoriaPadreId };
    const response = await apiClient.post('/admin/categorias', payload);
    return response.data;
  },

  // Update an existing category or subcategory
  async updateCategory(id, nombre) {
    const payload = { nombre: nombre.trim() };
    const response = await apiClient.patch(`/admin/categorias/${id}`, payload);
    return response.data;
  },

  // Optional: reorder categories (admin)
  async reorderCategories(reorderData) {
    const response = await apiClient.patch('/admin/categorias/reorder', reorderData);
    return response.data;
  },
};

export default categoriasService;

