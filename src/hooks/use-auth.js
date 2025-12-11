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

  async function login(email, password) {
    try {
      // Attempt login (may store token in localStorage)
      const loginResp = await authService.login(email, password);

      // After login, try to fetch the current user from the server.
      // This ensures we have a valid session/token and obtain the canonical user object.
      try {
        const me = await authService.getCurrentUser();
        // Save user to localStorage for session persistence
        localStorage.setItem('user', JSON.stringify(me));
        dispatch(loginAction(me));

        // Redirect based on where user came from
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });

        toast.success('¡Bienvenido de nuevo!');
        return { success: true };
      } catch (err) {
        // If fetching current user failed with 401, clear any stored token and return error
        const message = err.response?.data?.message || err.response?.data?.detail || err?.message || 'No autenticado';
        // ensure we don't show duplicate toasts if interceptor did
        if (!err?._toastsShown) toast.error(message);
        // dispatch logout just in case
        dispatch(logoutAction());
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        return { success: false, error: message };
      }
    } catch (error) {
        const message = error.response?.data?.message || 'Correo o contraseña incorrectos.';
        if (!error?._toastsShown) toast.error(message);
        return { success: false, error: message };
      }
    };
  
    const logout = async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        // Clear all auth-related data from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
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
        if (!error?._toastsShown) toast.error(message);
        return { success: false, error: message };
      }
    };

  return { user, isAuthenticated, isLoading, login, logout, register };
};
