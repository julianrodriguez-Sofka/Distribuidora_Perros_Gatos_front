import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pedidosService } from '../../../services/pedidos-service';
import { Button, OrderStatusBadge, Modal, Select } from '../../../components/ui/index';
import { formatPrice, formatDate } from '../../../utils/validation';
import { toast } from '../../../utils/toast';
import './style.css';

// Map backend statuses to frontend display names
const STATUS_MAP = {
  'Pendiente': 'Pendiente',
  'Enviado': 'Enviado',
  'Entregado': 'Entregado',
  'Cancelado': 'Cancelado',
};

const ORDER_STATUSES = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
const FILTER_OPTIONS = ['Todos', ...ORDER_STATUSES];

const getValidTransitions = (currentStatus) => {
  // Normalize status name
  const normalizedStatus = STATUS_MAP[currentStatus] || currentStatus;
  
  const transitions = {
    'Pendiente': ['Enviado', 'Cancelado'],
    'Enviado': ['Entregado', 'Cancelado'],
    'Entregado': [],
    'Cancelado': [],
  };
  return transitions[normalizedStatus] || [];
};

export const AdminPedidosPage = () => {
  const dispatch = useDispatch();
  const { orders, filter, isLoading } = useSelector((state) => state.pedidos);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      dispatch({ type: 'FETCH_ORDERS_REQUEST' });
      const data = await pedidosService.getAllOrders();
      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data });
    } catch (error) {
      console.error('Error loading orders:', error);
      dispatch({ type: 'FETCH_ORDERS_FAILURE', payload: error.message });
      if (!error?._toastsShown) toast.error('Error al cargar los pedidos');
    }
  };

  const handleFilterChange = (newFilter) => {
    dispatch({ type: 'SET_ORDER_FILTER', payload: newFilter });
  };

  const handleViewOrder = async (orderId) => {
    try {
      const order = await pedidosService.getAdminOrderById(orderId);
      console.log('Order data received:', order);
      console.log('Client name:', order.clienteNombre || order.cliente_nombre);
      console.log('Address:', order.direccion_entrega || order.direccionEnvio);
      console.log('Phone:', order.telefono_contacto);
      console.log('Payment method:', order.metodo_pago);
      console.log('Items:', order.items);
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

  const filteredOrders = filter === 'Todos'
    ? orders
    : orders.filter(order => order.estado === filter);

  return (
    <div className="admin-pedidos-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Pedidos</h1>
      </div>

      <div className="filters">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={filter === option ? 'primary' : 'outline'}
            size="medium"
            onClick={() => handleFilterChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading">Cargando pedidos...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron pedidos con ese estado.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Método Pago</th>
                <th>Fecha</th>
                <th>Subtotal</th>
                <th>Envío</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const validTransitions = getValidTransitions(order.estado);
                const canEdit = validTransitions.length > 0;
                // Get date from multiple possible fields
                const orderDate = order.fecha_creacion || order.fecha || order.created_at;
                // Get client name from multiple possible fields
                const clientName = order.clienteNombre || order.cliente_nombre || `Usuario ID: ${order.usuario_id}`;
                const clientEmail = order.clienteEmail || order.cliente_email || 'N/A';
                const direccion = order.direccion_entrega || order.direccionEnvio || 'No especificada';
                const metodoPago = order.metodo_pago ? 
                  order.metodo_pago.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                  'No especificado';
                const subtotal = order.subtotal || order.total || 0;
                const costoEnvio = order.costo_envio || 0;

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{clientName}</td>
                    <td>{clientEmail}</td>
                    <td className="address-cell" title={direccion}>
                      {direccion.length > 30 ? `${direccion.substring(0, 30)}...` : direccion}
                    </td>
                    <td>{metodoPago}</td>
                    <td>{formatDate(orderDate)}</td>
                    <td>{formatPrice(subtotal)}</td>
                    <td>{formatPrice(costoEnvio)}</td>
                    <td>{formatPrice(order.total || 0)}</td>
                    <td>
                      <OrderStatusBadge status={order.estado} />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          Ver
                        </Button>
                        {canEdit && (
                          <Select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusChange(order.id, e.target.value);
                                // Reset select value after change
                                setTimeout(() => {
                                  e.target.value = '';
                                }, 0);
                              }
                            }}
                            className="status-select"
                            disabled={isUpdating}
                            options={[
                              { value: '', label: 'Cambiar estado' },
                              ...validTransitions.map((status) => ({
                                value: status,
                                label: status
                              }))
                            ]}
                            placeholder="Cambiar estado"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Pedido ${selectedOrder.id}`}
          size="large"
        >
          <div className="order-details">
            <div className="order-detail-section">
              <h3>Cliente</h3>
              <p><strong>Nombre:</strong> {selectedOrder.clienteNombre || selectedOrder.cliente_nombre || 'N/A'}</p>
              <p><strong>ID:</strong> {selectedOrder.clienteId || selectedOrder.cliente_id || selectedOrder.usuario_id || 'N/A'}</p>
              {(selectedOrder.clienteEmail || selectedOrder.cliente_email) && (
                <p><strong>Email:</strong> {selectedOrder.clienteEmail || selectedOrder.cliente_email}</p>
              )}
              {(selectedOrder.clienteTelefono || selectedOrder.cliente_telefono) && (
                <p><strong>Teléfono del Cliente:</strong> {selectedOrder.clienteTelefono || selectedOrder.cliente_telefono}</p>
              )}
            </div>
            
            <div className="order-detail-section">
              <h3>Envío</h3>
              <p><strong>Dirección de Entrega:</strong> {selectedOrder.direccion_entrega || selectedOrder.direccionEnvio || 'No especificada'}</p>
              <p><strong>Teléfono de Contacto:</strong> {selectedOrder.telefono_contacto || 'No especificado'}</p>
              {selectedOrder.nota_especial && (
                <p><strong>Nota Especial:</strong> {selectedOrder.nota_especial}</p>
              )}
            </div>

            <div className="order-detail-section">
              <h3>Productos</h3>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => {
                    // Try to get product name from different possible sources
                    const productName = item.nombre || 
                                      selectedOrder.productos?.[index]?.nombre || 
                                      `Producto ID: ${item.producto_id}`;
                    return (
                      <tr key={item.id || index}>
                        <td>{productName}</td>
                        <td>{item.cantidad}</td>
                        <td>{formatPrice(item.precio_unitario)}</td>
                        <td>{formatPrice(item.precio_unitario * item.cantidad)}</td>
                      </tr>
                    );
                  }) || selectedOrder.productos?.map((product, index) => (
                    <tr key={index}>
                      <td>{product.nombre}</td>
                      <td>{product.cantidad}</td>
                      <td>{formatPrice(product.precioUnitario)}</td>
                      <td>{formatPrice(product.precioUnitario * product.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-detail-section">
              <h3>Resumen de Costos</h3>
              <div className="cost-breakdown">
                <div className="cost-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total || 0)}</span>
                </div>
                <div className="cost-row">
                  <span>Costo de Envío:</span>
                  <span>{formatPrice(selectedOrder.costo_envio || 0)}</span>
                </div>
                <div className="cost-row cost-total">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.total || 0)}</span>
                </div>
              </div>
            </div>

            <div className="order-detail-section">
              <h3>Información de Pago</h3>
              <p><strong>Método de Pago:</strong> {
                selectedOrder.metodo_pago ? 
                  selectedOrder.metodo_pago.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                  'No especificado'
              }</p>
              {selectedOrder.nota_especial && (
                <p><strong>Nota Especial:</strong> {selectedOrder.nota_especial}</p>
              )}
            </div>

            <div className="order-detail-section">
              <h3>Información General</h3>
              <p><strong>Estado:</strong> <OrderStatusBadge status={selectedOrder.estado} /></p>
              <p><strong>Fecha de Creación:</strong> {formatDate(selectedOrder.fecha_creacion || selectedOrder.fecha)}</p>
              
              {/* Change Status Section */}
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
                            // Reset select value after change
                            setTimeout(() => {
                              e.target.value = '';
                            }, 0);
                          }
                        }}
                        className="status-select-modal"
                        disabled={isUpdating}
                        options={[
                          { value: '', label: 'Seleccionar nuevo estado' },
                          ...validTransitions.map((status) => ({
                            value: status,
                            label: status
                          }))
                        ]}
                        placeholder="Seleccionar nuevo estado"
                      />
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

