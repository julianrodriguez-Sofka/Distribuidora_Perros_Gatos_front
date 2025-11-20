import apiClient from './api-client';

export const inventarioService = {
  // Admin: Update inventory
  async updateInventory(productId, inventoryData) {
    const response = await apiClient.patch(`/admin/inventario/${productId}`, inventoryData);
    return response.data;
  },

  // Admin: Get inventory history
  async getInventoryHistory(productId) {
    const response = await apiClient.get(`/admin/inventario/${productId}/historial`);
    return response.data;
  },

  // Admin: Search products
  async searchProducts(query) {
    const response = await apiClient.get('/admin/inventario/search', {
      params: { q: query },
    });
    return response.data;
  },
};

