import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usuariosService } from '../../../services/usuarios-service';
import { pedidosService } from '../../../services/pedidos-service';
import { Button } from '../../../components/ui/index';
import { getPetPreferences, formatPrice, formatDate } from '../../../utils/validation';
import { toast } from '../../../utils/toast';
import './detail.css';

export const AdminUsuarioDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await usuariosService.getUserById(id);
      setUser(userData);

      // Load user orders
      const allOrders = await pedidosService.getAllOrders();
      const filteredOrders = allOrders.filter(order => order.clienteId === id);
      setUserOrders(filteredOrders);
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Error al cargar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Cargando usuario...</div>;
  }

  if (!user) {
    return <div className="error">Usuario no encontrado</div>;
  }

  const petPreferences = getPetPreferences(user.tienePerros, user.tieneGatos);

  return (
    <div className="admin-usuario-detail-page">
      <div className="page-header">
        <Button variant="ghost" size="small" onClick={() => navigate('/admin/usuarios')}>
          ← Volver a la lista
        </Button>
        <h1 className="page-title">Perfil de Usuario</h1>
      </div>

      <div className="user-details">
        <div className="user-detail-section">
          <h2>Datos Personales</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>ID:</strong> {user.id}
            </div>
            <div className="detail-item">
              <strong>Nombre completo:</strong> {user.nombreCompleto}
            </div>
            <div className="detail-item">
              <strong>Cédula:</strong> {user.cedula}
            </div>
            <div className="detail-item">
              <strong>Correo:</strong> {user.email}
            </div>
            <div className="detail-item">
              <strong>Teléfono:</strong> {user.telefono}
            </div>
            <div className="detail-item">
              <strong>Dirección de envío:</strong> {user.direccionEnvio}
            </div>
          </div>
        </div>

        <div className="user-detail-section">
          <h2>Preferencias de Mascotas</h2>
          <p>{petPreferences}</p>
        </div>

        <div className="user-detail-section">
          <h2>Pedidos del Usuario</h2>
          {userOrders.length === 0 ? (
            <p>Este usuario no tiene pedidos registrados.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID de pedido</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {userOrders
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  .map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{formatDate(order.fecha)}</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>{order.estado}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

