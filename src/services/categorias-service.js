import apiClient, { apiClient2 } from './api-client';

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

  // Create a subcategory. Backend expects { categoriaId, nombre }
  async createSubcategory(categoriaId, nombre) {
    const payload = { categoriaId: String(categoriaId), nombre: nombre.trim() };
    const response = await apiClient2.post('/admin/subcategorias', payload);
    return response.data;
  },

  // Update an existing category or subcategory
  async updateCategory(id, nombre) {
    const payload = { nombre: nombre.trim() };
    const response = await apiClient.patch(`/admin/categorias/${id}`, payload);
    return response.data;
  },

  // Update a subcategory: backend expects { categoriaId, nombre }
  async updateSubcategory(id, categoriaId, nombre) {
    const payload = { categoriaId: String(categoriaId), nombre: nombre.trim() };
    const response = await apiClient2.patch(`/admin/subcategorias/${id}`, payload);
    return response.data;
  },

  // Delete a category by id. Add query param sync=true when needed by backend.
  async deleteCategory(id, { sync = true } = {}) {
    const url = `/admin/categorias/${id}` + (sync ? '?sync=true' : '');
    const response = await apiClient.delete(url);
    return response.data;
  },
  // Optional: reorder categories (admin)
  async reorderCategories(reorderData) {
    const response = await apiClient.patch('/admin/categorias/reorder', reorderData);
    return response.data;
  },
};

export default categoriasService;

