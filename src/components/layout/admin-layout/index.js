import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../header';
import { Footer } from '../footer';
import { ToastContainer } from '../../ui/toast';
import { useToast } from '../../../hooks/use-toast';
import './style.css';

const adminMenuItems = [
  { path: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
  { path: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { path: '/admin/productos', label: 'Productos', icon: '🛍️' },
  { path: '/admin/categorias', label: 'Categorías', icon: '📁' },
  { path: '/admin/carrusel', label: 'Carrusel', icon: '🖼️' },
  { path: '/admin/inventario', label: 'Inventario', icon: '📊' },
];

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { toasts } = useToast();

  const handleRemoveToast = () => {};

  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-container">
        <aside className="admin-sidebar" role="complementary" aria-label="Menú de administración">
          <nav className="admin-nav">
            <h2 className="admin-nav-title">Administración</h2>
            <ul className="admin-nav-list">
              {adminMenuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="admin-main-content" role="main">
          {children}
        </main>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  );
};

