import apiClient from './api-client';

export const productosService = {
  // Get catalog (grouped by category and subcategory)
  async getCatalog({ skip = 0, limit = 20, q = '' } = {}) {
    const params = { skip, limit };
    if (q) params.q = q;
    const response = await apiClient.get('/admin/productos', { params });
    return response.data;
  },

  // Get single product
  async getProductById(id) {
    const response = await apiClient.get(`/admin/productos/${id}`);
    return response.data;
  },

  // Admin: Create product (then optionally upload image to /products/{id}/images)
  async createProduct(productData) {
    const { imagenFile, ...payload } = productData || {};

    const response = await apiClient.post('/admin/productos', payload);
    let created = response.data;

    // Determine created id robustly: response may return the created object, an array, or other shape
    let createdId = null;
    if (created && typeof created === 'object') {
      if (created.id) createdId = created.id;
      else if (Array.isArray(created) && created.length) {
        const last = created[created.length - 1];
        if (last && last.id) createdId = last.id;
      } else if (created.producto && created.producto.id) {
        createdId = created.producto.id;
      }
    }

    // Fallback: fetch list and take last item id
    if (!createdId) {
      try {
        const listResp = await apiClient.get('/admin/productos');
        const list = listResp.data;
        if (Array.isArray(list) && list.length) {
          const last = list[list.length - 1];
          if (last && last.id) createdId = last.id;
        }
      } catch (err) {
        console.error('Could not determine created product id:', err);
      }
    }

    // If we have an image and an id, upload it
    if (imagenFile && createdId) {
      try {
        const form = new FormData();
        form.append('file', imagenFile);
        const imgResp = await apiClient.post(`/admin/productos/${createdId}/images`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageData = imgResp.data;
        const url = imageData?.imagen_url ?? imageData?.url ?? imageData?.path ?? null;
        if (url) {
          // attach imagenUrl to returned created object if possible
          if (!created || typeof created !== 'object') created = {};
          created.imagenUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
        }
      } catch (err) {
        console.error('Image upload failed for created product:', err);
      }
    }

    return created;
  },

  // Admin: Update product
  async updateProduct(id, productData) {
    const { imagenFile, ...payload } = productData || {};

    const response = await apiClient.put(`/admin/productos/${id}`, payload);
    const updated = response.data;

    if (imagenFile) {
      try {
        const form = new FormData();
        form.append('file', imagenFile);
        const imgResp = await apiClient.post(`/admin/productos/${id}/images`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageData = imgResp.data;
        const url = imageData?.imagen_url ?? imageData?.url ?? imageData?.path ?? null;
        if (url) {
          updated.imagenUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
        }
      } catch (err) {
        console.error('Image upload failed for updated product:', err);
      }
    }

    return updated;
  },

  // Admin: Upload a single image for a product
  async uploadProductImage(productId, file) {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post(`/admin/productos/${productId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin: Get a specific product image
  async getProductImage(productId, imageId) {
    const response = await apiClient.get(`/admin/productos/${productId}/images/${imageId}`);
    return response.data;
  },

  // Admin: Get all products
  async getAllProducts() {
    const response = await apiClient.get('/admin/productos');
    return response.data;
  },

  // Admin: Get products paged
  async getProductsPage({ skip = 0, limit = 20, q = '' } = {}) {
    const params = { skip, limit };
    if (q) params.q = q;
    const response = await apiClient.get('/admin/productos', { params });
    return response.data;
  },

  // Admin: Eliminar producto
  async eliminarProducto(id) {
    const response = await apiClient.delete(`/admin/productos/${id}`);
    return response.data;
  },
};

export default productosService;

