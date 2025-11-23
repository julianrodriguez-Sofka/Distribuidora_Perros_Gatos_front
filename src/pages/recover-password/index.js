import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth-service";
import { useToast } from "../../hooks/use-toast";

const RecoverPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = require('react-router-dom').useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resendVerificationCode(email);
      showToast("Código reenviado. Revisa tu correo.", "success");
      setTimeout(() => {
        navigate('/verification-code', { state: { email } });
      }, 1200);
    } catch (error) {
      showToast(error?.message || "Error al enviar el código.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Recuperar Contraseña</h1>
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label htmlFor="email" className="login-label">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            placeholder="usuario@ejemplo.com"
          />
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar código de verificación"}
          </button>
        </form>
        <div className="login-links">
          <Link to="/login" className="login-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
