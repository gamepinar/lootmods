import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to page they wanted or profile
  const from = location.state?.from?.pathname || '/perfil';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.nombre.trim()) {
          throw new Error('El nombre es obligatorio.');
        }
        await register(formData.nombre, formData.email, formData.password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ nombre: '', email: '', password: '' });
  };

  return (
    <div className="auth-container">
      <div className="glass glow-purple auth-card">
        <h2 className="auth-title">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="auth-subtitle">
          {isLogin ? 'Ingresa para descargar tus mods favoritos y gestionar tus donaciones.' : 'Únete a la comunidad para acceder a descargas y registrar tus donaciones.'}
        </p>

        {error && (
          <div className="auth-error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div>
              <label htmlFor="nombre-input">Nombre Completo</label>
              <input
                id="nombre-input"
                type="text"
                placeholder="Ej. Juan Pérez"
                className="auth-input glass"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email-input">Correo Electrónico</label>
            <input
              id="email-input"
              type="email"
              placeholder="correo@ejemplo.com"
              className="auth-input glass"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="password-input">Contraseña</label>
            <input
              id="password-input"
              type="password"
              placeholder="••••••••"
              className="auth-input glass"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="download-btn glow-purple auth-submit-btn"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <p 
          id="auth-toggle-mode"
          onClick={toggleMode} 
          className="auth-toggle-link"
        >
          {isLogin ? (
            <>¿No tienes cuenta? <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Crea una aquí</span></>
          ) : (
            <>¿Ya tienes cuenta? <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Inicia sesión</span></>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
