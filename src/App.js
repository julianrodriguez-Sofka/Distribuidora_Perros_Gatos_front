import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MainLayout } from './components/layout/main-layout';
import { AdminLayout } from './components/layout/admin-layout';
import { ProtectedRoute } from './components/layout/protected-route';
import { HomePage } from './pages/home';
import RecoverPasswordPage from './pages/recover-password';
import VerificationCodePage from './pages/verification-code';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { CartPage } from './pages/cart';
import { AdminPedidosPage } from './pages/Admin/pedidos';
import { AdminUsuariosPage } from './pages/Admin/usuarios';
import { AdminUsuarioDetailPage } from './pages/Admin/usuarios/detail';
import { AdminProductosPage } from './pages/Admin/productos';
import NuevoProductoPage from './pages/Admin/productos/nuevo';
import EditarProductoPage from './pages/Admin/productos/editar';
import { AdminCategoriasPage } from './pages/Admin/categorias';
import AdminCarruselPage from './pages/Admin/carrusel';
import { AdminInventarioPage } from './pages/Admin/inventario';
import { NotFoundPage } from './pages/not-found';
import { authService } from './services/auth-service';
import { loginSuccess } from './redux/actions/auth-actions';
import { cartUtils } from './utils/cart';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Check if user is authenticated on mount (only once)
    if (hasCheckedAuth.current) return;
    
    const checkAuth = async () => {
      hasCheckedAuth.current = true;
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(loginSuccess(user));
          // Only redirect to admin products if:
          // 1. User is admin
          // 2. User is on the home page, login, or register pages
          // 3. User is NOT already on an admin page
          try {
            const { isAdminUser } = await import('./utils/auth');
            if (isAdminUser(user)) {
              const currentPath = window.location.pathname;
              const isAdminPage = currentPath.startsWith('/admin/');
              // Only redirect if user is on home page or login/register pages, and NOT already on admin page
              if (!isAdminPage && (currentPath === '/' || currentPath === '/login' || currentPath === '/registro')) {
                navigate('/admin/productos', { replace: true });
              }
              // If user is already on an admin page, don't redirect - let them navigate freely
            }
          } catch (err) {
            // fallback to previous checks
            if (user.rol === 'admin' || user.role === 'admin') {
              const currentPath = window.location.pathname;
              const isAdminPage = currentPath.startsWith('/admin/');
              if (!isAdminPage && (currentPath === '/' || currentPath === '/login' || currentPath === '/registro')) {
                navigate('/admin/productos', { replace: true });
              }
            }
          }
        }
      } catch (error) {
        // User not authenticated - this is normal and expected
        // Only log in development, don't show errors to user
        if (process.env.NODE_ENV === 'development') {
          console.log('User not authenticated (this is normal on first load)');
        }
        // Silently handle 401 - it means user is not logged in, which is fine
        // The error is already marked as silent by the interceptor
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = cartUtils.getCart();
    if (savedCart.length > 0) {
      dispatch({ type: 'CART_LOAD', payload: savedCart });
    }
  }, [dispatch]);

  return (
    <Routes>
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
        path="/admin/productos/editar/:id"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <EditarProductoPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos/nuevo"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <NuevoProductoPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recuperar-contrasena"
        element={
          <MainLayout>
            <RecoverPasswordPage />
          </MainLayout>
        }
      />
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
        path="/verification-code"
        element={
          <MainLayout>
            <VerificationCodePage />
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
