# ⭐ Instrucciones Técnicas para Implementar la HU Frontend: "Sistema de Calificaciones y Reseñas de Productos"

**Objetivo**: Implementar la interfaz de usuario para que los clientes puedan ver, crear y gestionar calificaciones de productos, y visualizar estadísticas agregadas. Este documento está pensado para ser leído y ejecutado por una IA o por un desarrollador frontend React.

---

## ⚙️ Alcance (Frontend únicamente)
- Framework: React con Redux para estado global
- Componentes: Cards de productos con estrellas, modal/formulario de calificación, lista de reseñas, panel de productos pendientes
- Servicios: `calificaciones-service.js` para comunicación con API backend
- Estado: Redux slices para calificaciones, productos calificables
- Rutas: Integración en vistas de productos, perfil de usuario, admin panel

---

## 🎨 Componentes Principales

### 1. **RatingStars Component** (Componente de Estrellas)

**Ubicación**: `src/components/RatingStars.jsx`

**Props**:
```javascript
{
  rating: number,        // 0-5, puede ser decimal (ej: 4.5)
  totalReviews: number,  // cantidad total de calificaciones
  size: string,          // 'small' | 'medium' | 'large'
  showCount: boolean,    // mostrar "(42 reseñas)"
  interactive: boolean,  // si permite seleccionar rating
  onChange: function     // callback cuando se selecciona (solo si interactive)
}
```

**Diseño Visual**:
- Estrellas amarillas llenas (★) para la parte entera
- Media estrella (⯨) si hay decimales >= 0.3
- Estrellas grises vacías (☆) para el resto
- Texto opcional: `"4.5 (42 reseñas)"`

**Ejemplo de Uso**:
```jsx
<RatingStars 
  rating={4.5} 
  totalReviews={42} 
  size="medium"
  showCount={true}
  interactive={false}
/>
```

---

### 2. **ProductRatingCard Component** (Card de Producto con Rating)

**Ubicación**: `src/components/ProductRatingCard.jsx`

**Integración en Product Card**:
- Mostrar `<RatingStars>` debajo del nombre del producto
- Si `promedio_calificacion === 0`, mostrar "Sin calificaciones aún"
- Usar datos de `producto.promedio_calificacion` y `producto.total_calificaciones`

**Ejemplo**:
```jsx
<div className="product-card">
  <img src={producto.imagenes[0]} alt={producto.nombre} />
  <h3>{producto.nombre}</h3>
  
  <RatingStars 
    rating={producto.promedio_calificacion || 0}
    totalReviews={producto.total_calificaciones || 0}
    size="small"
    showCount={true}
  />
  
  <p className="price">${producto.precio}</p>
  <button>Agregar al Carrito</button>
</div>
```

---

### 3. **CreateRatingModal Component** (Modal para Crear Calificación)

**Ubicación**: `src/components/CreateRatingModal.jsx`

**Props**:
```javascript
{
  producto: object,      // datos del producto a calificar
  pedidoId: number,     // id del pedido entregado
  isOpen: boolean,
  onClose: function,
  onSuccess: function   // callback después de crear rating
}
```

**Formulario**:
```jsx
<Modal isOpen={isOpen} onClose={onClose}>
  <h2>Califica: {producto.nombre}</h2>
  
  <div className="rating-selector">
    <label>Calificación *</label>
    <RatingStars 
      rating={selectedRating}
      size="large"
      interactive={true}
      onChange={(rating) => setSelectedRating(rating)}
    />
  </div>

  <div className="comment-input">
    <label>Comentario (opcional)</label>
    <textarea 
      maxLength={500}
      placeholder="Comparte tu experiencia con este producto..."
      value={comentario}
      onChange={(e) => setComentario(e.target.value)}
    />
    <span className="char-count">{comentario.length}/500</span>
  </div>

  <div className="modal-actions">
    <button onClick={onClose}>Cancelar</button>
    <button onClick={handleSubmit} disabled={selectedRating === 0}>
      Publicar Calificación
    </button>
  </div>
</Modal>
```

**Validaciones Cliente**:
- `selectedRating` debe ser 1-5 (requerido)
- `comentario` max 500 caracteres (opcional)
- Mostrar toast si faltan campos obligatorios

**Submit Handler**:
```javascript
const handleSubmit = async () => {
  if (selectedRating === 0) {
    toast.error('Por favor, selecciona una calificación');
    return;
  }

  try {
    await calificacionesService.createRating({
      producto_id: producto.id,
      pedido_id: pedidoId,
      calificacion: selectedRating,
      comentario: comentario.trim() || null
    });
    
    toast.success('Calificación creada exitosamente');
    onSuccess();
    onClose();
  } catch (error) {
    // Backend devuelve mensajes exactos
    toast.error(error.response?.data?.message || 'Error al crear calificación');
  }
};
```

---

### 4. **ProductReviewsList Component** (Lista de Reseñas)

**Ubicación**: `src/components/ProductReviewsList.jsx`

**Props**:
```javascript
{
  productoId: number,
  limit: number  // default 10
}
```

**Estructura**:
```jsx
<div className="reviews-list">
  <h3>Reseñas de Clientes</h3>
  
  {/* Stats Summary */}
  <div className="reviews-summary">
    <div className="avg-rating">
      <span className="big-number">{stats.promedio_calificacion.toFixed(1)}</span>
      <RatingStars rating={stats.promedio_calificacion} size="medium" />
      <span>{stats.total_calificaciones} calificaciones</span>
    </div>
    
    <div className="rating-distribution">
      {[5,4,3,2,1].map(stars => (
        <div key={stars} className="rating-bar">
          <span>{stars}★</span>
          <div className="bar">
            <div 
              className="fill" 
              style={{width: `${(stats[`total_${stars}_estrellas`] / stats.total_calificaciones * 100)}%`}}
            />
          </div>
          <span>{stats[`total_${stars}_estrellas`]}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Reviews List */}
  <div className="reviews-items">
    {reviews.map(review => (
      <div key={review.id} className="review-card">
        <div className="review-header">
          <span className="user-name">{review.usuario_nombre}</span>
          <RatingStars rating={review.calificacion} size="small" />
          <span className="date">{formatDate(review.fecha_creacion)}</span>
        </div>
        <p className="review-comment">{review.comentario}</p>
      </div>
    ))}
  </div>

  {hasMore && (
    <button onClick={loadMore}>Ver más reseñas</button>
  )}
</div>
```

**Lógica de Carga**:
```javascript
useEffect(() => {
  const fetchReviews = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        calificacionesService.getProductRatings(productoId, { skip: 0, limit }),
        calificacionesService.getProductStats(productoId)
      ]);
      
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  if (productoId) {
    fetchReviews();
  }
}, [productoId, limit]);
```

---

### 5. **MyRatingsPage Component** (Página de Mis Calificaciones)

**Ubicación**: `src/pages/MyRatingsPage.jsx`

**Ruta**: `/mi-cuenta/calificaciones`

**Secciones**:

#### A. **Productos Pendientes de Calificar**

```jsx
<section className="pending-ratings">
  <h2>Productos para Calificar</h2>
  <p className="subtitle">De tus pedidos entregados</p>
  
  {pendingProducts.length === 0 ? (
    <p className="empty-state">No tienes productos pendientes de calificar</p>
  ) : (
    <div className="products-grid">
      {pendingProducts.map(item => (
        <div key={item.producto_id} className="ratable-product-card">
          <img src={item.producto_imagen} alt={item.producto_nombre} />
          <h4>{item.producto_nombre}</h4>
          <p className="delivery-date">
            Entregado el {formatDate(item.fecha_entrega)}
          </p>
          <button onClick={() => openRatingModal(item)}>
            Calificar Producto
          </button>
        </div>
      ))}
    </div>
  )}
</section>
```

#### B. **Mis Calificaciones Publicadas**

```jsx
<section className="my-ratings">
  <h2>Mis Calificaciones</h2>
  
  {myRatings.length === 0 ? (
    <p className="empty-state">Aún no has calificado ningún producto</p>
  ) : (
    <div className="ratings-list">
      {myRatings.map(rating => (
        <div key={rating.id} className="my-rating-card">
          <div className="product-info">
            <img src={rating.producto_imagen} alt={rating.producto_nombre} />
            <div>
              <h4>{rating.producto_nombre}</h4>
              <RatingStars rating={rating.calificacion} size="small" />
              <span className="date">{formatDate(rating.fecha_creacion)}</span>
            </div>
          </div>
          
          <p className="comment">{rating.comentario}</p>
          
          <div className="actions">
            <button onClick={() => handleEdit(rating)}>
              <EditIcon /> Editar
            </button>
            <button onClick={() => handleDelete(rating.id)} className="delete">
              <DeleteIcon /> Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
```

**Handlers**:
```javascript
const handleEdit = (rating) => {
  setEditingRating(rating);
  setSelectedRating(rating.calificacion);
  setComentario(rating.comentario || '');
  setEditModalOpen(true);
};

const handleUpdate = async () => {
  try {
    await calificacionesService.updateRating(editingRating.id, {
      calificacion: selectedRating,
      comentario: comentario.trim()
    });
    
    toast.success('Calificación actualizada exitosamente');
    fetchMyRatings(); // refresh list
    setEditModalOpen(false);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error al actualizar');
  }
};

const handleDelete = async (ratingId) => {
  if (!window.confirm('¿Estás seguro de eliminar esta calificación?')) return;
  
  try {
    await calificacionesService.deleteRating(ratingId);
    toast.success('Calificación eliminada exitosamente');
    fetchMyRatings();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error al eliminar');
  }
};
```

---

### 6. **AdminRatingsPage Component** (Panel Admin de Calificaciones)

**Ubicación**: `src/pages/admin/AdminRatingsPage.jsx`

**Ruta**: `/admin/calificaciones`

**Funcionalidades**:

#### A. **Filtros**

```jsx
<div className="filters">
  <input 
    type="text"
    placeholder="Buscar por producto o usuario..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  
  <select value={visibleFilter} onChange={(e) => setVisibleFilter(e.target.value)}>
    <option value="">Todas</option>
    <option value="true">Visibles</option>
    <option value="false">Ocultas</option>
  </select>
  
  <select value={productoFilter} onChange={(e) => setProductoFilter(e.target.value)}>
    <option value="">Todos los productos</option>
    {productos.map(p => (
      <option key={p.id} value={p.id}>{p.nombre}</option>
    ))}
  </select>
</div>
```

#### B. **Tabla de Calificaciones**

```jsx
<table className="ratings-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Producto</th>
      <th>Usuario</th>
      <th>Rating</th>
      <th>Comentario</th>
      <th>Fecha</th>
      <th>Estado</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {ratings.map(rating => (
      <tr key={rating.id}>
        <td>{rating.id}</td>
        <td>{rating.producto_nombre}</td>
        <td>{rating.usuario_nombre}</td>
        <td>
          <RatingStars rating={rating.calificacion} size="small" />
        </td>
        <td className="comment-cell">
          {rating.comentario?.substring(0, 50)}
          {rating.comentario?.length > 50 && '...'}
        </td>
        <td>{formatDate(rating.fecha_creacion)}</td>
        <td>
          <span className={`badge ${rating.visible ? 'visible' : 'hidden'}`}>
            {rating.visible ? 'Visible' : 'Oculto'}
          </span>
          <span className={`badge ${rating.aprobado ? 'approved' : 'pending'}`}>
            {rating.aprobado ? 'Aprobado' : 'Pendiente'}
          </span>
        </td>
        <td>
          <button onClick={() => toggleVisible(rating)}>
            {rating.visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          <button onClick={() => toggleApproved(rating)}>
            {rating.aprobado ? <XIcon /> : <CheckIcon />}
          </button>
          <button onClick={() => deleteRating(rating.id)} className="delete">
            <DeleteIcon />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

<Pagination 
  currentPage={page}
  totalPages={Math.ceil(total / pageSize)}
  onPageChange={setPage}
/>
```

**Handlers de Moderación**:
```javascript
const toggleVisible = async (rating) => {
  try {
    await calificacionesService.adminUpdateRating(rating.id, {
      visible: !rating.visible
    });
    toast.success(`Calificación ${!rating.visible ? 'visible' : 'oculta'}`);
    fetchRatings();
  } catch (error) {
    toast.error('Error al actualizar visibilidad');
  }
};

const toggleApproved = async (rating) => {
  try {
    await calificacionesService.adminUpdateRating(rating.id, {
      aprobado: !rating.aprobado
    });
    toast.success(`Calificación ${!rating.aprobado ? 'aprobada' : 'rechazada'}`);
    fetchRatings();
  } catch (error) {
    toast.error('Error al actualizar aprobación');
  }
};

const deleteRating = async (ratingId) => {
  if (!window.confirm('¿Eliminar esta calificación permanentemente?')) return;
  
  try {
    await calificacionesService.adminDeleteRating(ratingId);
    toast.success('Calificación eliminada exitosamente');
    fetchRatings();
  } catch (error) {
    toast.error('Error al eliminar calificación');
  }
};
```

---

## 📡 Servicio de API: `calificaciones-service.js`

**Ubicación**: `src/services/calificaciones-service.js`

```javascript
import apiClient from './api-client';

class CalificacionesService {
  // ============ Cliente ============
  
  // Crear calificación
  async createRating(ratingData) {
    const response = await apiClient.post('/calificaciones', ratingData);
    return response.data;
  }

  // Obtener mis calificaciones
  async getMyRatings(skip = 0, limit = 100) {
    const response = await apiClient.get('/calificaciones/mis-calificaciones', {
      params: { skip, limit }
    });
    return response.data;
  }

  // Obtener calificaciones de un producto (público)
  async getProductRatings(productoId, { skip = 0, limit = 50 } = {}) {
    const response = await apiClient.get(`/calificaciones/producto/${productoId}`, {
      params: { skip, limit }
    });
    return response.data;
  }

  // Obtener estadísticas de un producto
  async getProductStats(productoId) {
    const response = await apiClient.get(`/calificaciones/producto/${productoId}/stats`);
    return response.data;
  }

  // Obtener estadísticas de múltiples productos (batch)
  async getProductsStats(productoIds) {
    const promises = productoIds.map(id => this.getProductStats(id));
    const results = await Promise.allSettled(promises);
    
    const statsMap = {};
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        statsMap[productoIds[index]] = result.value;
      }
    });
    
    return statsMap;
  }

  // Obtener productos pendientes de calificar
  async getRatableProducts() {
    const response = await apiClient.get('/calificaciones/productos-pendientes');
    return response.data;
  }

  // Actualizar mi calificación
  async updateRating(ratingId, updateData) {
    const response = await apiClient.put(`/calificaciones/${ratingId}`, updateData);
    return response.data;
  }

  // Eliminar mi calificación
  async deleteRating(ratingId) {
    const response = await apiClient.delete(`/calificaciones/${ratingId}`);
    return response.data;
  }

  // ============ Admin ============

  // Listar todas las calificaciones (admin)
  async adminGetAllRatings({ skip = 0, limit = 100, productoId, usuarioId, visibleOnly } = {}) {
    const response = await apiClient.get('/admin/calificaciones', {
      params: { skip, limit, producto_id: productoId, usuario_id: usuarioId, visible_only: visibleOnly }
    });
    return response.data;
  }

  // Obtener calificación por ID (admin)
  async adminGetRatingById(ratingId) {
    const response = await apiClient.get(`/admin/calificaciones/${ratingId}`);
    return response.data;
  }

  // Actualizar calificación (admin - moderación)
  async adminUpdateRating(ratingId, updateData) {
    const response = await apiClient.put(`/admin/calificaciones/${ratingId}`, updateData);
    return response.data;
  }

  // Eliminar calificación (admin)
  async adminDeleteRating(ratingId) {
    const response = await apiClient.delete(`/admin/calificaciones/${ratingId}`);
    return response.data;
  }

  // Recalcular estadísticas de un producto
  async adminRecalculateStats(productoId) {
    const response = await apiClient.post(`/admin/calificaciones/producto/${productoId}/recalcular-stats`);
    return response.data;
  }
}

export const calificacionesService = new CalificacionesService();
```

---

## 🎨 Estilos CSS (Guía de Diseño)

### Rating Stars

```css
.rating-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.rating-stars.small { font-size: 14px; }
.rating-stars.medium { font-size: 18px; }
.rating-stars.large { font-size: 24px; }

.rating-stars .star {
  color: #fbbf24; /* yellow-400 */
}

.rating-stars .star.empty {
  color: #d1d5db; /* gray-300 */
}

.rating-stars.interactive .star {
  cursor: pointer;
  transition: transform 0.2s;
}

.rating-stars.interactive .star:hover {
  transform: scale(1.2);
}

.rating-count {
  margin-left: 8px;
  font-size: 0.875rem;
  color: #6b7280; /* gray-500 */
}
```

### Review Card

```css
.review-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.review-header .user-name {
  font-weight: 600;
  color: #111827;
}

.review-header .date {
  margin-left: auto;
  font-size: 0.875rem;
  color: #9ca3af;
}

.review-comment {
  color: #4b5563;
  line-height: 1.6;
}
```

### Rating Distribution Bars

```css
.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-bar .bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-bar .fill {
  height: 100%;
  background: #fbbf24;
  transition: width 0.3s;
}
```

---

## 🔄 Integración con Redux (Opcional)

### Rating Slice

**Ubicación**: `src/store/slices/ratingsSlice.js`

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { calificacionesService } from '../../services/calificaciones-service';

export const fetchMyRatings = createAsyncThunk(
  'ratings/fetchMy',
  async () => {
    return await calificacionesService.getMyRatings();
  }
);

export const fetchRatableProducts = createAsyncThunk(
  'ratings/fetchRatable',
  async () => {
    return await calificacionesService.getRatableProducts();
  }
);

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState: {
    myRatings: [],
    ratableProducts: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRatings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.myRatings = action.payload;
      })
      .addCase(fetchMyRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRatableProducts.fulfilled, (state, action) => {
        state.ratableProducts = action.payload;
      });
  }
});

export default ratingsSlice.reducer;
```

---

## ✅ Checklist de Implementación

### Componentes Core
- [ ] `RatingStars` - componente reutilizable de estrellas
- [ ] `ProductRatingCard` - integrar estrellas en product cards
- [ ] `CreateRatingModal` - modal para crear/editar calificación
- [ ] `ProductReviewsList` - lista de reseñas con stats

### Páginas Cliente
- [ ] `MyRatingsPage` - mis calificaciones y productos pendientes
- [ ] Integrar `ProductReviewsList` en página de detalle de producto

### Páginas Admin
- [ ] `AdminRatingsPage` - moderación de calificaciones
- [ ] Filtros por producto, usuario, estado
- [ ] Acciones de moderación (ocultar, aprobar, eliminar)

### Servicio API
- [ ] `calificaciones-service.js` con todos los endpoints
- [ ] Manejo de errores con mensajes del backend
- [ ] Batch fetching de stats para múltiples productos

### Validaciones
- [ ] Validación 1-5 estrellas antes de submit
- [ ] Límite 500 caracteres en comentario con contador
- [ ] Confirmación antes de eliminar calificación

### UX/UI
- [ ] Toast messages con mensajes exactos del backend
- [ ] Loading states en todas las operaciones async
- [ ] Empty states cuando no hay calificaciones
- [ ] Responsive design para mobile

### Testing
- [ ] Crear calificación en producto comprado
- [ ] Actualizar calificación existente
- [ ] Eliminar calificación propia
- [ ] Ver reseñas de producto sin auth
- [ ] Admin puede moderar todas las calificaciones

---

## 📱 Flujos de Usuario

### Flujo 1: Cliente Califica Producto

1. Usuario recibe pedido (estado: Entregado)
2. Navega a "Mi Cuenta" → "Calificaciones"
3. Ve sección "Productos para Calificar" con productos del pedido
4. Click en "Calificar Producto"
5. Modal se abre con rating selector y textarea
6. Selecciona estrellas (1-5) - requerido
7. Escribe comentario opcional (max 500 chars)
8. Click "Publicar Calificación"
9. Backend valida y crea calificación
10. Toast success: "Calificación creada exitosamente"
11. Producto se mueve de "Pendientes" a "Mis Calificaciones"

### Flujo 2: Ver Reseñas de Producto (Público)

1. Usuario (auth o anónimo) navega a página de producto
2. Scroll down a sección "Reseñas de Clientes"
3. Ve resumen de stats:
   - Promedio (ej: 4.5 ★)
   - Total de calificaciones
   - Distribución por estrellas (barras)
4. Lee reseñas individuales con:
   - Nombre de usuario
   - Calificación en estrellas
   - Comentario
   - Fecha
5. Click "Ver más reseñas" para paginar (si > 10)

### Flujo 3: Admin Modera Calificación

1. Admin navega a "Calificaciones" en panel admin
2. Ve tabla con todas las calificaciones
3. Usa filtros: producto, visible/oculto
4. Identifica calificación inapropiada
5. Click en icono de ojo para ocultar (visible: false)
6. Confirmación: calificación desaparece de vista pública
7. (Opcional) Click en X para no aprobar (aprobado: false)
8. (Opcional) Click en eliminar para borrar permanentemente

---

## 🎯 Mensajes Estandarizados (Toast)

Usar los mensajes exactos devueltos por el backend:

```javascript
// Éxitos
toast.success('Calificación creada exitosamente');
toast.success('Calificación actualizada exitosamente');
toast.success('Calificación eliminada exitosamente');

// Errores de validación
toast.error('Por favor, completa todos los campos obligatorios.');
toast.error('La calificación debe ser entre 1 y 5 estrellas.');
toast.error('El comentario no puede exceder 500 caracteres.');

// Errores de negocio
toast.error('Solo puedes calificar productos de pedidos entregados.');
toast.error('Ya has calificado este producto en este pedido.');
toast.error('Calificación no encontrada o no tienes permiso para modificarla.');

// Errores genéricos
toast.error(error.response?.data?.message || 'Error al procesar solicitud');
```

---

## 📝 Notas Finales

- **Sincronización**: Después de crear/actualizar/eliminar calificación, refrescar lista y stats
- **Performance**: Usar `getProductsStats` batch para cargar stats de múltiples productos
- **Cache**: Considerar cachear stats de productos con TTL corto (1-5 min)
- **Accessibilidad**: Asegurar que las estrellas tengan labels ARIA para screen readers
- **Mobile**: Hacer táctil el selector de estrellas con área de toque adecuada

---

**Archivo**: `HU/INSTRUCTIONS_HU_RATINGS_SYSTEM_FRONTEND.md`
