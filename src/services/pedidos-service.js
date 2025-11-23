import apiClient from './api-client';

export const pedidosService = {
  // Create order
  async createOrder(orderData) {
    const response = await apiClient.post('/api/pedidos', orderData);
    return response.data;
  },

  // Get user orders
  async getUserOrders() {
    const response = await apiClient.get('/api/pedidos');
    return response.data;
  },

  // Get order by id
  async getOrderById(id) {
    const response = await apiClient.get(`/pedidos/${id}`);
    return response.data;
  },

  // Admin: Get all orders
  async getAllOrders() {
    const response = await apiClient.get('/admin/pedidos');
    return response.data;
  },

  // Admin: Update order status
  async updateOrderStatus(id, status) {
    const response = await apiClient.patch(`/admin/pedidos/${id}`, { estado: status });
    return response.data;
  },
};

