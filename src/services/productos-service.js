import apiClient from './api-client';

export const productosService = {
  // Get catalog (grouped by category and subcategory)
  async getCatalog() {
    const response = await apiClient.get('/v1/productos/catalogo');
    return response.data;
  },

  // Get single product
  async getProductById(id) {
    const response = await apiClient.get(`/v1/productos/${id}`);
    return response.data;
  },

  // Admin: Create product
  async createProduct(productData) {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === 'imagenFile' && productData[key]) {
        formData.append('imagenFile', productData[key]);
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });
    
    const response = await apiClient.post('/admin/productos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin: Update product
  async updateProduct(id, productData) {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === 'imagenFile' && productData[key]) {
        formData.append('imagenFile', productData[key]);
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });
    
    const response = await apiClient.patch(`/admin/productos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin: Get all products
  async getAllProducts() {
    const response = await apiClient.get('/admin/productos');
    return response.data;
  },
};

