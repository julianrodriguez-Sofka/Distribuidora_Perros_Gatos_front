import apiClient from './api-client';

export const carouselService = {
  // Obtener imágenes del carrusel (público - sin autenticación)
  async getCarouselPublic() {
    const response = await apiClient.get('/carrusel/images');
    console.log('Carousel data from API:', response.data); // Debug log
    return response.data;
  },

  // Obtener imágenes del carrusel (admin - requiere autenticación)
  async getCarousel() {
    const response = await apiClient.get('/admin/carrusel');
    return response.data;
  },

  // Subir nueva imagen al carrusel
  async addImage(formData) {
    const response = await apiClient.post('/admin/carrusel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Eliminar imagen del carrusel
  async deleteImage(id) {
    const response = await apiClient.delete(`/admin/carrusel/${id}`);
    return response.data;
  },

  // Reordenar imágenes del carrusel
  async reorderImages(orderList) {
    const response = await apiClient.patch('/admin/carrusel/reorder', orderList);
    return response.data;
  },

  // Editar enlace de imagen
  async updateImage(id, data) {
    const response = await apiClient.patch(`/admin/carrusel/${id}`, data);
    return response.data;
  },
};

