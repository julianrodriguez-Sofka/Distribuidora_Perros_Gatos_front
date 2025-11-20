import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MainLayout } from './components/layout/main-layout';
import { AdminLayout } from './components/layout/admin-layout';
import { ProtectedRoute } from './components/layout/protected-route';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { CartPage } from './pages/cart';
import { AdminPedidosPage } from './pages/Admin/pedidos';
import { AdminUsuariosPage } from './pages/Admin/usuarios';
import { AdminUsuarioDetailPage } from './pages/Admin/usuarios/detail';
import { AdminProductosPage } from './pages/Admin/productos';
import { AdminCategoriasPage } from './pages/Admin/categorias';
import { AdminCarruselPage } from './pages/Admin/carrusel';
import { AdminInventarioPage } from './pages/Admin/inventario';
import { NotFoundPage } from './pages/not-found';
import { authService } from './services/auth-service';
import { loginSuccess } from './redux/actions/auth-actions';
import { cartUtils } from './utils/cart';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(loginSuccess(user));
        }
      } catch (error) {
        // User not authenticated
        console.log('User not authenticated');
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = cartUtils.getCart();
    if (savedCart.length > 0) {
      dispatch({ type: 'CART_LOAD', payload: savedCart });
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            {isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
          </MainLayout>
        }
      />
      <Route
        path="/registro"
        element={
          <MainLayout>
            {isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
          </MainLayout>
        }
      />
      <Route
        path="/carrito"
        element={
          <MainLayout>
            <CartPage />
          </MainLayout>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/pedidos"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminPedidosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsuariosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios/:id"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsuarioDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminProductosPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminCategoriasPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/carrusel"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminCarruselPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inventario"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminInventarioPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
