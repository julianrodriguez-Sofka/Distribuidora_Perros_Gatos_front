import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../../ui/index';
import { useAuth } from '../../../hooks/use-auth';
import { useCart } from '../../../hooks/use-cart';
import './style.css';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const isAdmin = user?.rol === 'admin';

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <Link to="/" className="header-logo" aria-label="Inicio">
          🐾 Distribuidora Perros y Gatos
        </Link>

        <nav className="header-nav" role="navigation" aria-label="Navegación principal">
          {isAuthenticated && isAdmin && (
            <Link to="/admin/pedidos" className="header-nav-link">
              Administración
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/carrito" className="header-cart-link" aria-label="Carrito de compras">
                🛒 Carrito
                {itemCount > 0 && (
                  <span className="header-cart-badge" aria-label={`${itemCount} productos en el carrito`}>
                    {itemCount}
                  </span>
                )}
              </Link>
              <span className="header-user">Hola, {user?.nombreCompleto || user?.email}</span>
              <Button variant="ghost" size="small" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/registro">
                <Button variant="ghost" size="small">Registro</Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="small">Iniciar Sesión</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

