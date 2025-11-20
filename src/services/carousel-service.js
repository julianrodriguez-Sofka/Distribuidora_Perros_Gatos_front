import apiClient from './api-client';

export const carouselService = {
  // Get carousel images
  async getCarousel() {
    const response = await apiClient.get('/carousel');
    return response.data;
  },

  // Admin: Add carousel image
  async addCarouselImage(imageData) {
    const formData = new FormData();
    if (imageData.imagenFile) {
      formData.append('imagenFile', imageData.imagenFile);
    }
    if (imageData.enlaceUrl) {
      formData.append('enlaceUrl', imageData.enlaceUrl);
    }
    
    const response = await apiClient.post('/admin/carousel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin: Delete carousel image
  async deleteCarouselImage(id) {
    const response = await apiClient.delete(`/admin/carousel/${id}`);
    return response.data;
  },

  // Admin: Reorder carousel images
  async reorderCarousel(reorderData) {
    const response = await apiClient.patch('/admin/carousel/reorder', reorderData);
    return response.data;
  },
};

