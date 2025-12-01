# Solución: Visualización y Modificación de Estado de Pedidos

## Problema Identificado

El usuario no podía:
1. Visualizar los detalles de un pedido (error "Pedido no encontrado")
2. Modificar el estado del pedido desde el modal de detalles

## Causas Raíz

1. **Ruta incorrecta en el frontend:**
   - El frontend estaba usando `/pedidos/${id}` (endpoint público) en lugar de `/admin/pedidos/${id}` (endpoint de administración)
   - Esto causaba que el endpoint no encontrara el pedido o no tuviera permisos

2. **Falta de nombres de productos:**
   - El backend no incluía los nombres de productos en la respuesta del pedido
   - Solo se enviaba el `producto_id`, lo que hacía difícil identificar los productos

3. **Método HTTP incorrecto:**
   - El frontend usaba `PATCH` pero el backend espera `PUT` para actualizar el estado

4. **Falta de funcionalidad en el modal:**
   - El modal de detalles no tenía una sección para cambiar el estado del pedido
   - Solo se podía cambiar desde la tabla principal

## Soluciones Implementadas

### Backend (`orders.py`)

1. **Mejora de `_pedido_to_response`:**
   - Agregada consulta batch para obtener nombres de productos desde la tabla `Productos`
   - Incluido el campo `nombre` en cada item del pedido
   - Manejo de errores si no se pueden obtener los nombres (fallback a "Producto ID: X")

   ```python
   # Get product IDs to fetch names
   producto_ids = [item.producto_id for item in items]
   productos_map = {}
   
   # Fetch product names in batch
   if producto_ids:
       try:
           producto_ids_list = [int(x) for x in producto_ids]
           placeholders = ','.join([f':prod_id_{i}' for i in range(len(producto_ids_list))])
           params = {f'prod_id_{i}': prod_id for i, prod_id in enumerate(producto_ids_list)}
           q_prod = text(f"SELECT id, nombre FROM Productos WHERE id IN ({placeholders})")
           for prod_row in db.execute(q_prod, params).fetchall():
               productos_map[prod_row.id] = prod_row.nombre
       except Exception as e:
           logger.warning(f"Error fetching product names: {e}")
   
   items_resp = [
       {
           "id": item.id,
           "producto_id": item.producto_id,
           "nombre": productos_map.get(item.producto_id, f"Producto ID: {item.producto_id}"),
           "cantidad": item.cantidad,
           "precio_unitario": float(item.precio_unitario),
       }
       for item in items
   ]
   ```

2. **Importación de `text`:**
   - Agregado `from sqlalchemy import desc, text` para permitir consultas SQL directas

### Frontend

#### `pedidos-service.js`

1. **Nuevo método `getAdminOrderById`:**
   ```javascript
   // Admin: Get order by id
   async getAdminOrderById(id) {
     const response = await apiClient.get(`/admin/pedidos/${id}`);
     return response.data;
   },
   ```

2. **Corrección de `updateOrderStatus`:**
   - Cambiado de `PATCH` a `PUT`
   - Agregado soporte para nota opcional
   - Ruta corregida a `/admin/pedidos/${id}/status`

   ```javascript
   // Admin: Update order status
   async updateOrderStatus(id, status, nota = null) {
     const payload = { estado: status };
     if (nota) {
       payload.nota = nota;
     }
     const response = await apiClient.put(`/admin/pedidos/${id}/status`, payload);
     return response.data;
   },
   ```

#### `pages/Admin/pedidos/index.js`

1. **Corrección de `handleViewOrder`:**
   - Cambiado de `getOrderById` a `getAdminOrderById`
   - Mejorado manejo de errores con mensajes más descriptivos

   ```javascript
   const handleViewOrder = async (orderId) => {
     try {
       const order = await pedidosService.getAdminOrderById(orderId);
       setSelectedOrder(order);
       setIsModalOpen(true);
     } catch (error) {
       console.error('Error loading order:', error);
       const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Pedido no encontrado';
       if (!error?._toastsShown) toast.error(errorMessage);
     }
   };
   ```

2. **Mejora de `handleStatusChange`:**
   - Agregado recarga automática de la lista de pedidos después de actualizar
   - Soporte para nota opcional
   - Mejor manejo de errores

   ```javascript
   const handleStatusChange = async (orderId, newStatus, nota = null) => {
     if (isUpdating) return;

     setIsUpdating(true);
     try {
       const updatedOrder = await pedidosService.updateOrderStatus(orderId, newStatus, nota);
       dispatch({ type: 'UPDATE_ORDER_STATUS_SUCCESS', payload: updatedOrder });
       toast.success('Estado del pedido actualizado exitosamente');
       
       // Reload orders list to reflect changes
       await loadOrders();
       
       if (selectedOrder?.id === orderId) {
         setSelectedOrder(updatedOrder);
       }
     } catch (error) {
       console.error('Error updating order status:', error);
       const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Error al actualizar el estado del pedido';
       if (!error?._toastsShown) toast.error(errorMessage);
     } finally {
       setIsUpdating(false);
     }
   };
   ```

3. **Nueva sección en el modal:**
   - Agregada sección "Cambiar Estado" en el modal de detalles
   - Muestra solo las transiciones válidas según el estado actual
   - Selector deshabilitado mientras se actualiza

   ```javascript
   <div className="status-change-section">
     <h4>Cambiar Estado</h4>
     {(() => {
       const validTransitions = getValidTransitions(selectedOrder.estado);
       if (validTransitions.length === 0) {
         return <p className="no-transitions">No hay transiciones disponibles para este estado.</p>;
       }
       return (
         <div className="status-change-controls">
           <Select
             value=""
             onChange={(e) => {
               if (e.target.value) {
                 handleStatusChange(selectedOrder.id, e.target.value);
                 e.target.value = '';
               }
             }}
             className="status-select-modal"
             disabled={isUpdating}
           >
             <option value="">Seleccionar nuevo estado</option>
             {validTransitions.map((status) => (
               <option key={status} value={status}>
                 {status}
               </option>
             ))}
           </Select>
         </div>
       );
     })()}
   </div>
   ```

#### `pages/Admin/pedidos/style.css`

1. **Nuevos estilos para la sección de cambio de estado:**
   ```css
   .status-change-section {
     margin-top: 20px;
     padding-top: 20px;
     border-top: 1px solid #e5e7eb;
   }

   .status-change-section h4 {
     font-size: 16px;
     font-weight: 600;
     color: #111827;
     margin: 0 0 12px 0;
   }

   .status-change-controls {
     display: flex;
     gap: 12px;
     align-items: center;
   }

   .status-select-modal {
     min-width: 200px;
     padding: 8px 12px;
     border: 1px solid #d1d5db;
     border-radius: 6px;
     font-size: 14px;
     background-color: white;
   }

   .status-select-modal:disabled {
     opacity: 0.6;
     cursor: not-allowed;
   }

   .no-transitions {
     color: #6b7280;
     font-style: italic;
     margin: 8px 0;
   }
   ```

## Archivos Modificados

### Backend
- `backend/api/app/routers/orders.py`: Mejora de `_pedido_to_response` para incluir nombres de productos

### Frontend
- `src/services/pedidos-service.js`: Nuevo método `getAdminOrderById` y corrección de `updateOrderStatus`
- `src/pages/Admin/pedidos/index.js`: Corrección de `handleViewOrder`, mejora de `handleStatusChange`, y nueva sección en el modal
- `src/pages/Admin/pedidos/style.css`: Nuevos estilos para la sección de cambio de estado

## Resultado

✅ **Visualización de pedidos:**
- Los administradores pueden ver los detalles completos de cualquier pedido
- Los nombres de productos se muestran correctamente en lugar de solo IDs
- Información completa del cliente, envío, productos, costos y método de pago

✅ **Modificación de estado:**
- Los administradores pueden cambiar el estado del pedido desde:
  - La tabla principal (dropdown en la columna "Acciones")
  - El modal de detalles (nueva sección "Cambiar Estado")
- Solo se muestran las transiciones válidas según el estado actual
- La lista de pedidos se actualiza automáticamente después de cambiar el estado

✅ **Transiciones de estado válidas:**
- `Pendiente` → `Enviado` o `Cancelado`
- `Enviado` → `Entregado` o `Cancelado`
- `Entregado` → (sin transiciones)
- `Cancelado` → (sin transiciones)

## Pruebas Realizadas

- ✅ Visualización de pedido desde la tabla principal
- ✅ Cambio de estado desde la tabla principal
- ✅ Cambio de estado desde el modal de detalles
- ✅ Validación de transiciones de estado
- ✅ Actualización automática de la lista después de cambiar estado
- ✅ Manejo de errores cuando el pedido no existe
- ✅ Visualización correcta de nombres de productos

