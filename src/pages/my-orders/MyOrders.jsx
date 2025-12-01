import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosService } from '../../services/pedidos-service';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidosService.getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
      if (err.response?.status === 401) {
        setError('Debes iniciar sesión para ver tus pedidos');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Error al cargar los pedidos. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getEstadoClass = (estado) => {
    const classes = {
      'Pendiente': 'status-pending',
      'Enviado': 'status-shipped',
      'Entregado': 'status-delivered',
      'Cancelado': 'status-cancelled'
    };
    return classes[estado] || 'status-default';
  };

  const getEstadoIcon = (estado) => {
    const icons = {
      'Pendiente': '⏳',
      'Enviado': '🚚',
      'Entregado': '✅',
      'Cancelado': '❌'
    };
    return icons[estado] || '📦';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const COSTO_ENVIO = 5000; // Costo de envío estándar en COP

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={loadOrders} className="btn-retry">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <h1>Mis Pedidos</h1>
        <p className="orders-subtitle">Revisa el estado de tus pedidos</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <span className="no-orders-icon">📦</span>
          <h2>No tienes pedidos aún</h2>
          <p>Cuando realices un pedido, aparecerá aquí</p>
          <button onClick={() => navigate('/')} className="btn-shop">
            Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Pedido #{order.id}</h3>
                  <span className="order-date">{formatDate(order.fecha_creacion)}</span>
                </div>
                <div className={`order-status ${getEstadoClass(order.estado)}`}>
                  <span className="status-icon">{getEstadoIcon(order.estado)}</span>
                  <span className="status-text">{order.estado}</span>
                </div>
              </div>

              <div className="order-details">
                {(() => {
                  const subtotal = order.items?.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0) || 0;
                  const totalConEnvio = subtotal + COSTO_ENVIO;
                  
                  return (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Subtotal productos:</span>
                        <span className="detail-value">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Costo de envío:</span>
                        <span className="detail-value envio-costo">
                          {formatCurrency(COSTO_ENVIO)}
                        </span>
                      </div>
                      <div className="detail-row total-row">
                        <span className="detail-label">Total del pedido:</span>
                        <span className="detail-value total-amount">{formatCurrency(totalConEnvio)}</span>
                      </div>
                    </>
                  );
                })()}
                <div className="detail-row">
                  <span className="detail-label">Método de pago:</span>
                  <span className="detail-value">{order.metodo_pago}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Dirección de entrega:</span>
                  <span className="detail-value">{order.direccion_entrega}</span>
                </div>
                {order.municipio && (
                  <div className="detail-row">
                    <span className="detail-label">Ciudad:</span>
                    <span className="detail-value">
                      {order.municipio}{order.departamento ? `, ${order.departamento}` : ''}
                    </span>
                  </div>
                )}
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items">
                  <h4>Productos ({order.items.length})</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={item.id || index} className="order-item">
                        {item.producto_imagen && (
                          <div className="item-image">
                            <img 
                              src={item.producto_imagen} 
                              alt={item.producto_nombre || 'Producto'}
                              onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                          </div>
                        )}
                        <div className="item-details">
                          <p className="item-name">{item.producto_nombre || `Producto #${item.producto_id}`}</p>
                          <p className="item-quantity">Cantidad: {item.cantidad}</p>
                        </div>
                        <div className="item-price">
                          {formatCurrency(item.precio_unitario * item.cantidad)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
