/**
 * Calificaciones Service
 * Servicio para gestionar calificaciones de productos
 */
import apiClient from './api-client';

export const calificacionesService = {
  /**
   * Crear una calificación para un producto
   * @param {number} productoId - ID del producto
   * @param {number} calificacion - Calificación de 1 a 5
   * @param {string} comentario - Comentario opcional
   * @returns {Promise} Response del servidor
   */
  async crearCalificacion(productoId, calificacion, comentario = null) {
    try {
      const response = await apiClient.post(`/calificaciones/productos/${productoId}`, {
        calificacion,
        comentario,
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear calificación:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las calificaciones de un producto
   * @param {number} productoId - ID del producto
   * @param {number} limit - Límite de resultados
   * @param {number} skip - Offset para paginación
   * @returns {Promise} Lista de calificaciones con promedio
   */
  async obtenerCalificacionesProducto(productoId, limit = 10, skip = 0) {
    try {
      const response = await apiClient.get(`/calificaciones/productos/${productoId}`, {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener calificaciones:', error);
      throw error;
    }
  },

  /**
   * Obtener solo el promedio de calificaciones de un producto
   * @param {number} productoId - ID del producto
   * @returns {Promise} Promedio de calificaciones
   */
  async obtenerPromedioProducto(productoId) {
    try {
      const response = await apiClient.get(`/calificaciones/productos/${productoId}/promedio`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener promedio:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las calificaciones de todos los productos (para admin)
   * @param {number} productoId - Filtro opcional por producto
   * @param {number} calificacion - Filtro opcional por estrellas
   * @param {number} limit - Límite de resultados
   * @param {number} skip - Offset para paginación
   * @returns {Promise} Lista de todas las calificaciones
   */
  async obtenerTodasCalificaciones(productoId = null, calificacion = null, limit = 100, skip = 0) {
    try {
      const params = { limit, skip };
      if (productoId) params.producto_id = productoId;
      if (calificacion) params.calificacion = calificacion;
      
      const response = await apiClient.get('/calificaciones/todas', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las calificaciones:', error);
      throw error;
    }
  },

  // Alias para compatibilidad
  obtenerCalificaciones(...args) {
    return this.obtenerCalificacionesProducto(...args);
  },
};

export default calificacionesService;
