import apiClient from './api-client';

export const authService = {
      // Crear producto
          async createProduct(formData) {
            // create product (formData may include imagenFile)
            const response = await apiClient.post('/admin/productos', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            let created = response.data;

            // determine id
            let createdId = null;
            if (created && typeof created === 'object') {
              if (created.id) createdId = created.id;
              else if (Array.isArray(created) && created.length) createdId = created[created.length - 1]?.id;
              else if (created.producto && created.producto.id) createdId = created.producto.id;
            }

            // fallback: fetch list and take last id
            if (!createdId) {
              try {
                const listResp = await apiClient.get('/admin/productos');
                const list = listResp.data;
                if (Array.isArray(list) && list.length) createdId = list[list.length - 1]?.id;
              } catch (err) {
                console.error('Could not determine created product id after create:', err);
              }
            }

            // if an image was provided in the formData and we have an id, upload it
            try {
              const file = formData.get && formData.get('imagenFile');
              if (file && createdId) {
                const imgForm = new FormData();
                imgForm.append('file', file);
                const imgResp = await apiClient.post(`/admin/productos/${createdId}/images`, imgForm, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                const imageData = imgResp.data;
                const url = imageData?.imagen_url ?? imageData?.url ?? imageData?.path ?? null;
                if (url && created && typeof created === 'object') {
                  created.imagenUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
                }
              }
            } catch (err) {
              console.error('Image upload failed after create:', err);
            }

            return created;
          },
    // Resend verification code
    async resendVerificationCode(email) {
      const response = await apiClient.post('/auth/resend-code', { email });
      return response.data;
    },
    // Listar productos (admin)
    async listarProductos() {
      try {
        const response = await apiClient.get('/admin/productos');
        return response.data;
      } catch (error) {
        throw error.response?.data || { status: 'error', message: 'Error al listar productos.' };
      }
    },
  // Login
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    // Try to persist token under common keys returned by different backends
    const data = response.data || {};
    const tokenCandidates = [
      data.access_token,
      data.token,
      data.accessToken,
      data.access_token ?? data.token ?? data.accessToken,
      data.data && data.data.access_token,
      data.data && data.data.token,
    ];
    const token = tokenCandidates.find(t => typeof t === 'string' && t.length > 0);
    if (token) {
      localStorage.setItem('access_token', token);
    }

    return response.data;
  },

  // Register
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Verify email
  async verifyEmail(email, code) {
    const response = await apiClient.post('/auth/verify-email', { email, code });
    return response.data;
  },

  // Logout
  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      // If 401 and no token, this is expected (user not logged in)
      // Don't throw error, just return null
      if (error.response?.status === 401 && !localStorage.getItem('access_token')) {
        return null;
      }
      // For other errors or 401 with token (expired), re-throw
      throw error;
    }
  },
};

