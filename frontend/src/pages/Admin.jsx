import { useState, useEffect } from 'react';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    imagenUrl: '',
    downloadUrl: '',
    categoria: 'Mod',
    version: '1.0.0',
    developer: '',
    instrucciones: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsLoggedIn(true);
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
      } else {
        setMessage(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setMessage('Error de conexión');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    try {
      const res = await fetch(`${API_URL}/content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('¡Contenido subido con éxito!');
        setForm({ nombre: '', descripcion: '', imagenUrl: '', downloadUrl: '', categoria: 'Mod', version: '1.0.0', developer: '', instrucciones: '' });
      } else {
        setMessage(data.error || 'Error al subir');
      }
    } catch (err) {
      setMessage('Error de conexión');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login" style={{maxWidth: '400px', margin: '4rem auto'}}>
        <h2 style={{marginBottom: '2rem'}}>Inventario de Loot</h2>
        <form onSubmit={handleLogin} className="glass" style={{padding: '2rem', borderRadius: '1rem'}}>
          <div style={{marginBottom: '1rem'}}>
            <label>Email</label>
            <input 
              type="email" 
              className="search-input glass" 
              style={{paddingLeft: '1rem', marginTop: '0.5rem'}}
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          <div style={{marginBottom: '1.5rem', position: 'relative'}}>
            <label>Contraseña</label>
            <div style={{position: 'relative'}}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="search-input glass" 
                style={{paddingLeft: '1rem', marginTop: '0.5rem', paddingRight: '3rem'}}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-20%)',
                  opacity: 0.6,
                  color: 'white'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="download-btn glow-purple" style={{width: '100%'}}>Entrar</button>
          {message && <p style={{marginTop: '1rem', color: 'var(--accent-cyan)'}}>{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2>Subir Nuevo Contenido</h2>
        <button 
          onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} 
          className="glass"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.8rem',
            color: '#ff4444',
            fontSize: '0.9rem',
            fontWeight: '600',
            border: '1px solid rgba(255, 68, 68, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.target.style.background = 'rgba(255, 68, 68, 0.1)'; e.target.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.2)'; }}
          onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.boxShadow = 'none'; }}
        >
          Cerrar Sesión
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="glass" style={{padding: '2rem', borderRadius: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
        <div style={{gridColumn: 'span 2'}}>
          <label>Nombre del Mod/Juego</label>
          <input type="text" className="search-input glass" style={{paddingLeft: '1rem'}} required value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
        </div>
        <div style={{gridColumn: 'span 2'}}>
          <label>Descripción</label>
          <textarea className="search-input glass" style={{paddingLeft: '1rem', height: '100px', resize: 'none'}} required value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} />
        </div>
        <div>
          <label>URL Imagen</label>
          <input type="text" className="search-input glass" style={{paddingLeft: '1rem'}} value={form.imagenUrl} onChange={(e) => setForm({...form, imagenUrl: e.target.value})} />
        </div>
        <div>
          <label>URL Descarga</label>
          <input type="text" className="search-input glass" style={{paddingLeft: '1rem'}} required value={form.downloadUrl} onChange={(e) => setForm({...form, downloadUrl: e.target.value})} />
        </div>
        <div>
          <label>Categoría</label>
          <select className="search-input glass" style={{paddingLeft: '1rem'}} value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})}>
            <option value="Mod">Mod</option>
            <option value="Game">Juego</option>
            <option value="Tool">Herramienta</option>
          </select>
        </div>
        <div>
          <label>Versión</label>
          <input type="text" className="search-input glass" style={{paddingLeft: '1rem'}} value={form.version} onChange={(e) => setForm({...form, version: e.target.value})} />
        </div>
        <div>
          <label>Desarrollador</label>
          <input type="text" className="search-input glass" style={{paddingLeft: '1rem'}} value={form.developer} onChange={(e) => setForm({...form, developer: e.target.value})} />
        </div>
        <div style={{gridColumn: 'span 2'}}>
          <button type="submit" className="download-btn glow-purple" style={{width: '100%', padding: '1rem'}}>Subir Contenido</button>
        </div>
      </form>
      {message && <p style={{marginTop: '1.5rem', textAlign: 'center', color: 'var(--accent-purple)', fontWeight: 'bold'}}>{message}</p>}
    </div>
  );
}

export default Admin;
