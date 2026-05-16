import { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [content, setContent] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    imagenUrl: '',
    downloadUrl: '',
    categoria: 'Mod',
    developer: '',
    instrucciones: '',
    seguridad: '✅ Virus Free'
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const [activeTab, setActiveTab] = useState('nuevo');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchContent();
    }
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}/content`);
      const data = await res.json();
      if (Array.isArray(data)) setContent(data);
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setMessage('🚀 Iniciando subida...');

    const storageRef = ref(storage, `mods/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(p));
        setMessage(`⏳ Subiendo: ${Math.round(p)}%`);
      }, 
      (error) => {
        console.error("ERROR FIREBASE:", error);
        setMessage(`❌ Error: ${error.message}`);
        setUploading(false);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setForm({ ...form, imagenUrl: url });
          setMessage('✅ ¡Imagen lista!');
          setUploading(false);
        });
      }
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
        fetchContent();
      } else { setMessage(data.error || 'Error login'); }
    } catch (err) { setMessage('Error de conexión'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/content/${editingId}` : `${API_URL}/content`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMessage(editingId ? '✅ ¡Actualizado con éxito!' : '✅ ¡Publicado con éxito!');
        setForm({ nombre: '', descripcion: '', imagenUrl: '', downloadUrl: '', categoria: 'Mod', developer: '', instrucciones: '', seguridad: '✅ Virus Free' });
        setEditingId(null);
        fetchContent();
      }
    } catch (err) { setMessage('❌ Error en la operación'); }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setActiveTab('nuevo');
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      imagenUrl: item.imagenUrl,
      downloadUrl: item.downloadUrl,
      categoria: item.categoria || 'Mod',
      developer: item.developer || '',
      instrucciones: item.instrucciones || '',
      seguridad: item.seguridad || '✅ Virus Free'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de borrar este contenido?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/content/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        fetchContent();
        setMessage('🗑️ Eliminado correctamente');
      }
    } catch (err) { console.error(err); }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login" style={{maxWidth: '400px', margin: '4rem auto'}}>
        <form onSubmit={handleLogin} className="glass" style={{padding: '2rem', borderRadius: '1rem'}}>
          <h2 style={{marginBottom: '1.5rem'}}>Loot Admin</h2>
          <input type="email" placeholder="Email" className="search-input glass" style={{marginBottom: '1rem'}} value={credentials.email} onChange={e => setCredentials({...credentials, email: e.target.value})} />
          <input type="password" placeholder="Password" className="search-input glass" style={{marginBottom: '1.5rem'}} value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} />
          <button type="submit" className="download-btn glow-purple" style={{width: '100%'}}>Entrar</button>
        </form>
      </div>
    );
  }

  const tabStyle = (tabName) => ({
    padding: '0.8rem 1.5rem',
    borderRadius: '0.5rem',
    background: activeTab === tabName ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
    border: activeTab === tabName ? '1px solid var(--accent-purple)' : '1px solid transparent',
    color: activeTab === tabName ? 'white' : 'var(--text-secondary)',
    fontWeight: activeTab === tabName ? 'bold' : 'normal',
    transition: 'all 0.3s ease'
  });

  return (
    <div className="admin-dashboard" style={{maxWidth: '900px', margin: '2rem auto', padding: '0 2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2>Loot Admin</h2>
        <button onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} className="mini-btn" style={{color: '#ff4444'}}>Salir</button>
      </div>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', overflowX: 'auto'}}>
        <button style={tabStyle('nuevo')} onClick={() => {setActiveTab('nuevo'); setEditingId(null); setForm({nombre:'',descripcion:'',imagenUrl:'',downloadUrl:'',categoria:'Mod', developer:'', instrucciones:'', seguridad: '✅ Virus Free'});}}>🆕 {editingId ? 'Editar Contenido' : 'Añadir Loot'}</button>
        <button style={tabStyle('inventario')} onClick={() => setActiveTab('inventario')}>📦 Inventario</button>
        <button style={tabStyle('donaciones')} onClick={() => setActiveTab('donaciones')}>💸 Donaciones</button>
      </div>

      {activeTab === 'nuevo' && (
        <form onSubmit={handleSubmit} className="glass" style={{padding: '2rem', borderRadius: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '4rem'}}>
          <div style={{gridColumn: 'span 2'}}>
            <label>Nombre del Mod/Juego</label>
            <input type="text" className="search-input glass" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          
          <div style={{gridColumn: 'span 2'}}>
            <label>Descripción</label>
            <textarea className="search-input glass" style={{height: '80px'}} required value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
          </div>

          <div>
            <label>Categoría</label>
            <select className="search-input glass" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
              <option value="Mod">Mod</option>
              <option value="Game">Juego</option>
              <option value="Tool">Herramienta</option>
            </select>
          </div>

          <div>
            <label>Security (Escribe el estado)</label>
            <input type="text" className="search-input glass" value={form.seguridad} onChange={e => setForm({...form, seguridad: e.target.value})} />
          </div>

          <div>
            <label>Desarrollador / Autor</label>
            <input type="text" className="search-input glass" value={form.developer} onChange={e => setForm({...form, developer: e.target.value})} />
          </div>

          <div>
            <label>URL de Descarga</label>
            <input type="text" className="search-input glass" required value={form.downloadUrl} onChange={e => setForm({...form, downloadUrl: e.target.value})} />
          </div>

          <div style={{gridColumn: 'span 2'}}>
            <label>Instrucciones de Instalación (Opcional)</label>
            <textarea className="search-input glass" style={{height: '60px'}} value={form.instrucciones} onChange={e => setForm({...form, instrucciones: e.target.value})} />
          </div>
          
          <div style={{gridColumn: 'span 2'}}>
            <label>Imagen del Mod (Seleccionar archivo)</label>
            <input type="file" className="search-input glass" accept="image/*" onChange={handleImageUpload} />
            {uploading && (
              <div style={{marginTop: '0.5rem', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
                <div style={{width: `${progress}%`, height: '100%', background: 'var(--accent-cyan)', transition: 'width 0.3s'}}></div>
              </div>
            )}
            {form.imagenUrl && (
              <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <img src={form.imagenUrl.startsWith('http') ? form.imagenUrl : `/${form.imagenUrl}`} alt="Preview" style={{width: '80px', height: '80px', borderRadius: '0.8rem', objectFit: 'cover', border: '2px solid var(--accent-cyan)'}} />
                <span style={{fontSize: '0.8rem', opacity: 0.6}}>Imagen lista ✅</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={uploading} className="download-btn glow-purple" style={{gridColumn: 'span 2', padding: '1rem', opacity: uploading ? 0.5 : 1}}>
            {editingId ? 'GUARDAR CAMBIOS' : 'PUBLICAR EN LOOTMODS'}
          </button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({nombre:'',descripcion:'',imagenUrl:'',downloadUrl:'',categoria:'Mod', developer:'', instrucciones:'', seguridad: '✅ Virus Free'});}} className="mini-btn" style={{gridColumn: 'span 2'}}>Cancelar Edición</button>}
        </form>
      )}

      {activeTab === 'donaciones' && (
        <div style={{marginTop: '1rem'}}>
          <h3 style={{color: '#10b981'}}>💸 Donaciones Pendientes</h3>
          <p style={{opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem'}}>Revisa las transferencias y pagos manuales. Al aprobarlas, aparecerán en el Muro de Honor.</p>
          <PendingDonations API_URL={API_URL} />
        </div>
      )}

      {activeTab === 'inventario' && (
        <div style={{marginTop: '1rem'}}>
          <h3>📦 Gestión de Inventario</h3>
          <p style={{opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem'}}>Administra, edita o elimina los mods y juegos publicados.</p>
          <div className="admin-list" style={{marginTop: '1.5rem'}}>
            {content.map(item => (
              <div key={item._id} className="glass" style={{display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem'}}>
                <img src={item.imagenUrl?.startsWith('http') ? item.imagenUrl : `/${item.imagenUrl}`} alt="" style={{width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover'}} />
                <div style={{flex: 1}}>
                  <h4 style={{margin: 0}}>{item.nombre}</h4>
                  <span style={{fontSize: '0.8rem', opacity: 0.5}}>{item.categoria} - <small style={{color: '#10b981'}}>{item.seguridad || '✅ Virus Free'}</small></span>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button onClick={() => handleEdit(item)} className="mini-btn" style={{background: 'var(--accent-cyan)', color: 'black'}}>Editar</button>
                  <button onClick={() => handleDelete(item._id)} className="mini-btn" style={{background: '#ff4444'}}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && <p style={{marginTop: '2rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-purple)'}}>{message}</p>}
    </div>
  );
}

function PendingDonations({ API_URL }) {
  const [pendientes, setPendientes] = useState([]);
  const token = localStorage.getItem('adminToken');

  const fetchPendientes = async () => {
    try {
      const res = await fetch(`${API_URL}/donations/admin/pendientes`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (Array.isArray(data)) setPendientes(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPendientes(); }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/donations/${id}/completar`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        alert('✅ Donación aprobada y visible en el muro.');
        fetchPendientes();
      }
    } catch (err) { console.error(err); }
  };

  if (pendientes.length === 0) return <p style={{opacity: 0.5}}>No hay donaciones pendientes por revisar.</p>;

  return (
    <div className="admin-list" style={{marginTop: '1.5rem'}}>
      {pendientes.map(don => (
        <div key={don._id} className="glass glow-cyan" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem'}}>
          <div>
            <h4 style={{margin: 0}}>{don.nombre}</h4>
            <span style={{fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold'}}>{don.moneda} {don.monto}</span>
          </div>
          <button onClick={() => handleApprove(don._id)} className="mini-btn" style={{background: '#10b981', color: 'black', fontWeight: 'bold'}}>APROBAR ✅</button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
