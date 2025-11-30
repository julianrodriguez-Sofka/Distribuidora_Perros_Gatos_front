import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pedidosService } from '../../../services/pedidos-service';
import { Button, OrderStatusBadge, Modal, Select } from '../../../components/ui/index';
import { formatPrice, formatDate } from '../../../utils/validation';
import { toast } from '../../../utils/toast';
import './style.css';

const ORDER_STATUSES = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
const FILTER_OPTIONS = ['Todos', ...ORDER_STATUSES];

const getValidTransitions = (currentStatus) => {
  const transitions = {
    'Pendiente': ['Enviado', 'Cancelado'],
    'Enviado': ['Entregado', 'Cancelado'],
    'Entregado': [],
    'Cancelado': [],
  };
  return transitions[currentStatus] || [];
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
      // Agregar nombre del cliente basado en usuario_id
      const ordersWithClient = data.map(order => ({
        ...order,
        clienteNombre: `Cliente #${order.usuario_id}` // Placeholder hasta que tengamos endpoint de usuarios
      }));
      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: ordersWithClient });
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
      // Agregar información del cliente
      const orderWithClient = {
        ...order,
        clienteNombre: `Cliente #${order.usuario_id}`,
        clienteId: order.usuario_id
      };
      setSelectedOrder(orderWithClient);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading order:', error);
      if (!error?._toastsShown) toast.error('Error al cargar el pedido');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const updatedOrder = await pedidosService.updateOrderStatus(orderId, newStatus);
      dispatch({ type: 'UPDATE_ORDER_STATUS_SUCCESS', payload: updatedOrder });
      toast.success('Estado del pedido actualizado exitosamente');
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      if (!error?._toastsShown) toast.error('Error al actualizar el estado del pedido');
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
                <th>Fecha</th>
                <th>Total</th>
                <th>Método Pago</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const validTransitions = getValidTransitions(order.estado);
                const canEdit = validTransitions.length > 0;

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.clienteNombre}</td>
                    <td>{formatDate(order.fecha_creacion)}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>{order.metodo_pago || 'N/A'}</td>
                    <td>{order.telefono_contacto || 'N/A'}</td>
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
                                e.target.value = '';
                              }
                            }}
                            options={[
                              { value: '', label: 'Cambiar estado' },
                              ...validTransitions.map(status => ({ value: status, label: status }))
                            ]}
                            className="status-select"
                            disabled={isUpdating}
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
              <p><strong>Nombre:</strong> {selectedOrder.clienteNombre}</p>
              <p><strong>ID:</strong> {selectedOrder.clienteId}</p>
            </div>
            
            <div className="order-detail-section">
              <h3>Información de Envío</h3>
              <p><strong>Dirección:</strong> {selectedOrder.direccion_entrega || 'No especificada'}</p>
              {selectedOrder.municipio && <p><strong>Ciudad:</strong> {selectedOrder.municipio}</p>}
              {selectedOrder.departamento && <p><strong>Departamento:</strong> {selectedOrder.departamento}</p>}
              {selectedOrder.pais && <p><strong>País:</strong> {selectedOrder.pais}</p>}
              <p><strong>Teléfono:</strong> {selectedOrder.telefono_contacto || 'No especificado'}</p>
              <p><strong>Método de Pago:</strong> {selectedOrder.metodo_pago || 'No especificado'}</p>
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
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>Producto #{item.producto_id}</td>
                      <td>{item.cantidad}</td>
                      <td>{formatPrice(item.precio_unitario)}</td>
                      <td>{formatPrice(item.precio_unitario * item.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-detail-section">
              <h3>Resumen del Pedido</h3>
              <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
              <p><strong>Estado:</strong> <OrderStatusBadge status={selectedOrder.estado} /></p>
              <p><strong>Fecha:</strong> {formatDate(selectedOrder.fecha_creacion)}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

