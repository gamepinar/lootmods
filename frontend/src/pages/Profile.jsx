import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [loadingDownloads, setLoadingDownloads] = useState(true);
  const [activeTab, setActiveTab] = useState('donaciones');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const res = await fetch(`${API_URL}/donations/mis-donaciones`, {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setDonations(data);
        } else {
          console.error('Error fetching donations:', data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDonations(false);
      }

      try {
        const res = await fetch(`${API_URL}/content/mis-descargas`, {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setDownloads(data);
        } else {
          console.error('Error fetching downloads:', data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDownloads(false);
      }
    };

    fetchProfileData();
  }, [token, navigate, API_URL]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="glass glow-purple profile-header">
        <div>
          <span className="profile-role-tag">
            {user.rol === 'admin' ? 'Administrador' : 'Miembro LootMods'}
          </span>
          <h2 className="profile-name">Hola, {user.nombre}</h2>
          <p className="profile-email">{user.email}</p>
        </div>
        <div>
          <button id="logout-btn" onClick={handleLogout} className="mini-btn logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="profile-tabs-bar">
        <button 
          id="tab-donaciones" 
          className={`profile-tab ${activeTab === 'donaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('donaciones')}
        >
          🎁 Mis Donaciones ({donations.length})
        </button>
        <button 
          id="tab-descargas" 
          className={`profile-tab ${activeTab === 'descargas' ? 'active' : ''}`}
          onClick={() => setActiveTab('descargas')}
        >
          💾 Mis Descargas ({downloads.length})
        </button>
      </div>

      <div className="glass profile-content-box">
        {activeTab === 'donaciones' ? (
          <div>
            <h3 className="profile-section-title">Historial de Donaciones</h3>
            {loadingDonations ? (
              <p>Cargando donaciones...</p>
            ) : donations.length === 0 ? (
              <div className="profile-empty-state">
                <p className="profile-empty-state-title">Aún no tienes donaciones registradas.</p>
                <p className="profile-empty-state-desc">Tus aportes nos ayudan a mantener el sitio activo.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="profile-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Monto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((don) => (
                      <tr key={don._id}>
                        <td className="fecha">
                          {new Date(don.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="monto">
                          {don.moneda === 'USD' ? 'US$' : 'AR$'} {don.monto}
                        </td>
                        <td>
                          <span className={`status-badge ${don.estado === 'completado' ? 'status-completed' : 'status-pending'}`}>
                            {don.estado === 'completado' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="profile-section-title">Historial de Descargas</h3>
            {loadingDownloads ? (
              <p>Cargando descargas...</p>
            ) : downloads.length === 0 ? (
              <div className="profile-empty-state">
                <p className="profile-empty-state-title">No tienes descargas registradas.</p>
                <p className="profile-empty-state-desc">Las descargas que realices estando logueado aparecerán aquí.</p>
              </div>
            ) : (
              <div className="profile-downloads-list">
                {downloads.map((dl) => (
                  <div key={dl._id} className="glass download-item-card">
                    {dl.contentImagen && (
                      <img src={dl.contentImagen} alt={dl.contentNombre} className="download-item-image" />
                    )}
                    <div className="download-item-info">
                      <h4 className="download-item-title">{dl.contentNombre}</h4>
                      <p className="download-item-date">
                        Descargado el {new Date(dl.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <a href={dl.downloadUrl} target="_blank" rel="noopener noreferrer" className="download-btn glow-purple download-btn-mini">
                        Descargar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
