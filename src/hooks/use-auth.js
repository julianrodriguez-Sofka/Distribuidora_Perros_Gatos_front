import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as loginAction, logout as logoutAction } from '../redux/actions/auth-actions';
import { authService } from '../services/auth-service';
import { toast } from '../utils/toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      dispatch(loginAction(response.user));
      
      // Redirect based on where user came from
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      toast.success('¡Bienvenido de nuevo!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Correo o contraseña incorrectos.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('Registro exitoso. Verifica tu correo electrónico.');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar usuario.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };
};

