import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Loot from './pages/Loot';
import Admin from './pages/Admin';
import ModDetails from './pages/ModDetails';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar glass">
        <Link to="/" className="logo">LOOTMODS</Link>
        <div className="nav-links">
          <Link to="/loot" className="nav-link">Loot</Link>
          <Link to="/admin" className="nav-link account-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loot" element={<Loot />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mod/:id" element={<ModDetails />} />
      </Routes>

      <footer style={{marginTop: '6rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', paddingBottom: '2rem'}}>
        &copy; 2026 LOOTMODS - For gamers, by gamers.
      </footer>
    </div>
  );
}

export default App;
