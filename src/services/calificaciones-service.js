/**
 * Calificaciones Service
 * Maneja todas las peticiones relacionadas con calificaciones de productos
 */
import apiClient from './api-client';

class CalificacionesService {
  /**
   * Crear una nueva calificación
   */
  async createRating(ratingData) {
    try {
      const response = await apiClient.post('/calificaciones', ratingData);
      return response.data;
    } catch (error) {
      console.error('Error creating rating:', error);
      throw error;
    }
  }

  /**
   * Obtener calificaciones del usuario autenticado
   */
  async getMyRatings(page = 0, limit = 100) {
    try {
      const response = await apiClient.get('/calificaciones/mis-calificaciones', {
        params: { skip: page * limit, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my ratings:', error);
      throw error;
    }
  }

  /**
   * Obtener calificaciones de un producto específico
   */
  async getProductRatings(productId, page = 0, limit = 50) {
    try {
      const response = await apiClient.get(`/calificaciones/producto/${productId}`, {
        params: { skip: page * limit, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product ratings:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de calificaciones de un producto
   */
  async getProductStats(productId) {
    try {
      const response = await apiClient.get(`/calificaciones/producto/${productId}/stats`);
      return response.data;
    } catch (error) {
      // Si es 404 o no hay stats, retornar stats vacías en lugar de fallar
      if (error.response?.status === 404 || error.response?.status === 500) {
        return {
          producto_id: productId,
          promedio_calificacion: 0,
          total_calificaciones: 0,
          total_5_estrellas: 0,
          total_4_estrellas: 0,
          total_3_estrellas: 0,
          total_2_estrellas: 0,
          total_1_estrella: 0,
          fecha_actualizacion: null
        };
      }
      console.error('Error fetching product stats:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas para múltiples productos
   */
  async getProductsStats(productIds) {
    try {
      // Hacer múltiples peticiones en paralelo
      const promises = productIds.map(id => this.getProductStats(id).catch(err => {
        // Si falla un producto, retornar stats vacías
        console.warn(`Failed to get stats for product ${id}:`, err.message);
        return {
          producto_id: id,
          promedio_calificacion: 0,
          total_calificaciones: 0
        };
      }));
      const results = await Promise.all(promises);
      
      // Crear un mapa producto_id -> stats
      const statsMap = {};
      results.forEach(stats => {
        statsMap[stats.producto_id] = stats;
      });
      
      return statsMap;
    } catch (error) {
      console.error('Error fetching products stats:', error);
      // Retornar objeto vacío en lugar de fallar
      return {};
    }
  }

  /**
   * Actualizar una calificación propia
   */
  async updateRating(ratingId, updateData) {
    try {
      const response = await apiClient.put(`/calificaciones/${ratingId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  }

  /**
   * Eliminar una calificación propia
   */
  async deleteRating(ratingId) {
    try {
      const response = await apiClient.delete(`/calificaciones/${ratingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting rating:', error);
      throw error;
    }
  }

  /**
   * Obtener productos que el usuario puede calificar
   */
  async getRatableProducts() {
    try {
      const response = await apiClient.get('/calificaciones/productos-pendientes');
      return response.data;
    } catch (error) {
      console.error('Error fetching ratable products:', error);
      throw error;
    }
  }

  // ============================================================
  // ADMIN ENDPOINTS
  // ============================================================

  /**
   * Obtener todas las calificaciones (admin)
   */
  async getAllRatingsAdmin(filters = {}) {
    try {
      const { page = 0, limit = 100, productoId, usuarioId, visibleOnly } = filters;
      
      const params = {
        skip: page * limit,
        limit
      };
      
      if (productoId) params.producto_id = productoId;
      if (usuarioId) params.usuario_id = usuarioId;
      if (visibleOnly !== undefined) params.visible_only = visibleOnly;
      
      const response = await apiClient.get('/admin/calificaciones', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all ratings (admin):', error);
      throw error;
    }
  }

  /**
   * Obtener una calificación por ID (admin)
   */
  async getRatingByIdAdmin(ratingId) {
    try {
      const response = await apiClient.get(`/admin/calificaciones/${ratingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rating (admin):', error);
      throw error;
    }
  }

  /**
   * Actualizar cualquier calificación (admin)
   */
  async updateRatingAdmin(ratingId, updateData) {
    try {
      const response = await apiClient.put(`/admin/calificaciones/${ratingId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating rating (admin):', error);
      throw error;
    }
  }

  /**
   * Eliminar cualquier calificación (admin)
   */
  async deleteRatingAdmin(ratingId) {
    try {
      const response = await apiClient.delete(`/admin/calificaciones/${ratingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting rating (admin):', error);
      throw error;
    }
  }

  /**
   * Cambiar visibilidad de una calificación (admin)
   */
  async toggleRatingVisibility(ratingId) {
    try {
      const response = await apiClient.patch(`/admin/calificaciones/${ratingId}/toggle-visibility`);
      return response.data;
    } catch (error) {
      console.error('Error toggling rating visibility (admin):', error);
      throw error;
    }
  }
}

export const calificacionesService = new CalificacionesService();
