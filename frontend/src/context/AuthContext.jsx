import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser(null);
          }
        } else {
          try {
            const base64Url = storedToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            setUser({ id: decoded.id, rol: decoded.rol, nombre: decoded.nombre || 'Usuario' });
          } catch (err) {
            console.error('Error decoding token:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Credenciales inválidas');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.user && data.user.rol === 'admin') {
        localStorage.setItem('adminToken', data.token);
      }
      const userObj = {
        id: data.user.id || data.user._id,
        nombre: data.user.nombre,
        email: data.user.email,
        rol: data.user.rol
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      setToken(data.token);
      setUser(userObj);
      return userObj;
    }
    return null;
  };

  const register = async (nombre, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
      const userObj = {
        id: data.user.id || data.user._id,
        nombre: data.user.nombre,
        email: data.user.email,
        rol: data.user.rol
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      setToken(data.token);
      setUser(userObj);
      return userObj;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.rol === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
