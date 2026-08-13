import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Loot from './pages/Loot';
import Admin from './pages/Admin';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import ModDetails from './pages/ModDetails';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user } = useAuth();

  const getAccountLink = () => {
    if (!user) return '/auth';
    if (user.rol === 'admin') return '/panel';
    return '/perfil';
  };

  return (
    <div className="app-container">
      <nav className="navbar glass">
        <Link to="/" className="logo">LOOTMODS</Link>
        <div className="nav-links">
          <Link to="/loot" className="nav-link">Loot</Link>
          {!user ? (
            <Link to="/auth" className="download-btn glow-purple" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Registrarse
            </Link>
          ) : (
            <Link to={getAccountLink()} className="nav-link account-icon" title={`Perfil de ${user.nombre}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loot" element={<Loot />} />
        <Route path="/panel" element={<Admin />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/mod/:id" element={<ModDetails />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/privacidad" element={<Privacy />} />
      </Routes>

      <footer style={{marginTop: '6rem', paddingTop: '3rem', paddingBottom: '2rem', borderTop: '1px solid var(--glass-border)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
            <div>
              <h4 style={{marginBottom: '1rem', color: 'var(--accent-cyan)'}}>Navegación</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <Link to="/" style={{color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}>Inicio</Link>
                <Link to="/loot" style={{color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}>Loot Completo</Link>
                <Link to={getAccountLink()} style={{color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s'}}>Mi Cuenta</Link>
              </div>
            </div>
            <div>
              <h4 style={{marginBottom: '1rem', color: 'var(--accent-cyan)'}}>Legal</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <Link to="/terminos" style={{color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', cursor: 'pointer'}}>Términos y Condiciones</Link>
                <Link to="/privacidad" style={{color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', cursor: 'pointer'}}>Política de Privacidad</Link>
              </div>
            </div>
            <div>
              <h4 style={{marginBottom: '1rem', color: 'var(--accent-cyan)'}}>Información</h4>
              <p style={{fontSize: '0.9rem', opacity: 0.7, margin: 0}}>Todos los juegos y marcas pertenecen a sus respectivos propietarios.</p>
            </div>
          </div>
          <div style={{textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', opacity: 0.6}}>
            <p style={{margin: '0.5rem 0', fontSize: '0.85rem'}}>
              &copy; 2026 LOOTMODS - For gamers, by gamers.
            </p>
            <p style={{margin: '0.5rem 0', fontSize: '0.8rem'}}>
              LOOTMODS es solo un sitio de distribución de mods, herramientas y contenido de terceros. No nos hacemos responsables por el contenido alojado.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
