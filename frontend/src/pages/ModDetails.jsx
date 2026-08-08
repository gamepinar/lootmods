import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ModDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [item, setItem] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [donorName, setDonorName] = useState(user?.nombre || '');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [qrData, setQrData] = useState({ visible: false, img: '', name: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const donationConfig = {
    USD: { 
      symbol: '$', vals: [1, 3, 5, 10, 20],
      methods: [
        { id: 'binance', name: 'Binance Pay', color: '#F3BA2F' },
        { id: 'paypal', name: 'PayPal', color: '#0070BA' }
      ]
    },
    ARS: { 
      symbol: '$', vals: [1000, 2000, 5000, 10000, 20000],
      methods: [
        { id: 'qr', name: 'QR Pago', color: '#009EE3' },
        { id: 'mp', name: 'Mercado Pago', color: '#00B1EA' }
      ]
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/content/${id}`)
      .then(res => res.json())
      .then(data => setItem(data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (user?.nombre) {
      setDonorName(user.nombre);
    }
  }, [user]);

  const handleDownloadClick = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/content/${id}/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ downloadUrl: item.downloadUrl })
        });
      } catch (err) {
        console.error('Error tracking download:', err);
      }
    }
  };

  const handlePayment = async (method) => {
    if (!donorName.trim()) {
      alert('Por favor, ingresa tu nombre para aparecer en el Muro de Honor. / Please enter your name to appear on the Honor Wall.');
      return;
    }
    if (!selectedAmount) {
      alert('Por favor, selecciona un monto.');
      return;
    }
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['x-auth-token'] = token;
      }
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ nombre: donorName.trim(), monto: selectedAmount, moneda: currency, metodo: method.name })
      });
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.detalles || resData.error || 'Error al procesar el pago');
      }
      
      // Manejo de QR para métodos manuales
      if (method.id === 'binance') {
        setQrData({ visible: true, img: '/binance-pay.png', name: 'Binance Pay' });
        return;
      }
      if (method.id === 'qr' || method.id === 'mp') {
        setQrData({ visible: true, img: '/qr.png', name: 'Mercado Pago / Transferencia' });
        return;
      }

      if (currency === 'USD' && method.id === 'paypal') {
        window.open('https://paypal.me/pagosdeplata', '_blank');
        return;
      }

      if (resData.urlCheckout) {
        alert(`¡Gracias ${donorName}! Redirigiendo a la pasarela de pago segura...`);
        window.location.href = resData.urlCheckout;
        return;
      }

      alert(`¡Gracias ${donorName}! Redirigiendo a ${method.name}...`);
      setDonorName(user?.nombre || '');
      setSelectedAmount(null);
    } catch (err) { 
      console.error(err);
      alert(`Ocurrió un error: ${err.message}`);
    }
  };

  if (!item) return <div style={{padding: '5rem', textAlign: 'center'}}>Cargando...</div>;

  return (
    <div className="mod-details-container" style={{padding: '4rem 8%'}}>
      {qrData.visible && (
        <div className="modal-overlay" onClick={() => { setQrData({ visible: false, img: '', name: '' }); setDonorName(''); setSelectedAmount(null); }}>
          <div className="modal-content glass glow-cyan" onClick={e => e.stopPropagation()}>
            <h2 style={{color: 'var(--accent-cyan)'}}>{qrData.name}</h2>
            <p style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem'}}>
              Escanea el código para realizar tu apoyo de <b>{currency} {selectedAmount}</b>.
              <br />Una vez verificado, aparecerás en el Muro de Honor. / Once verified, you will appear on the Honor Wall.
            </p>
            <img src={qrData.img} alt="QR Code" className="qr-image" />
            <button 
              className="download-btn glow-purple" 
              style={{marginTop: '1rem', width: '100%'}}
              onClick={() => { setQrData({ visible: false, img: '', name: '' }); setDonorName(''); setSelectedAmount(null); }}
            >
              LISTO, YA APOYÉ ✅
            </button>
            <p style={{marginTop: '1rem', fontSize: '0.7rem', opacity: 0.5}}>Haz clic fuera o en el botón para cerrar.</p>
          </div>
        </div>
      )}

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <button onClick={() => navigate(-1)} style={{color: 'var(--accent-cyan)', fontSize: '0.9rem', cursor: 'pointer', background: 'none', border: 'none'}}>
          ← REGRESAR
        </button>
      </div>

      <section className="donation-mini-box glass glow-cyan" style={{marginBottom: '1.5rem', padding: '1rem'}}>
        <div className="currency-selector">
           {Object.keys(donationConfig).map(curr => (
             <button key={curr} onClick={() => { setCurrency(curr); setSelectedAmount(null); setSelectedMethod(null); }} className={currency === curr ? 'active' : ''} style={{fontSize: '0.65rem'}}>{curr}</button>
           ))}
        </div>
        <h4 style={{fontSize: '0.85rem'}}>Ayúdanos a mantener vivo LOOTMODS / Help us keep LOOTMODS alive</h4>
        <div style={{marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 5%'}}>
          <small style={{fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center'}}>1. Método de pago / Payment method</small>
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center'}}>
             {donationConfig[currency].methods.map(method => (
               <button 
                key={method.id} 
                onClick={() => setSelectedMethod(method)}
                className="mini-btn"
                style={{fontSize: '0.7rem', border: selectedMethod?.id === method.id ? `2px solid ${method.color}` : `1px solid ${method.color}88`, background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem'}}
               >
                 <span style={{color: method.color, opacity: 1, fontSize: '0.75rem'}}>{method.name}</span>
               </button>
             ))}
          </div>
        </div>

        {selectedMethod && (
          <>
            <div style={{marginTop: '0.8rem', textAlign: 'center'}}>
              <small style={{fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px'}}>2. Monto / Amount</small>
            </div>
            <div className="donation-grid-mini" style={{marginTop: '0.3rem'}}>
              {donationConfig[currency].vals.map(val => (
                <button 
                  key={val} 
                  onClick={() => setSelectedAmount(val)} 
                  className="mini-btn" 
                  style={{fontSize: '0.75rem', cursor: 'pointer', border: selectedAmount === val ? '2px solid #10b981' : '1px solid var(--glass-border)', color: '#10b981'}}
                >
                  {donationConfig[currency].symbol}{val.toLocaleString()}
                </button>
              ))}
            </div>

            <div style={{marginTop: '0.8rem', padding: '0 15%'}}>
               <input 
                type="text" 
                placeholder="Name (for the Honor Wall)" 
                className="search-input glass" 
                style={{fontSize: '0.75rem', padding: '0.4rem 1rem', textAlign: 'center'}}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
               />
            </div>

            <div style={{marginTop: '1rem', textAlign: 'center', paddingBottom: '0.5rem'}}>
              <button 
                className="download-btn glow-cyan" 
                onClick={() => handlePayment(selectedMethod)}
                style={{padding: '0.6rem 2rem', fontSize: '0.85rem'}}
              >
                APOYAR / SUPPORT
              </button>
            </div>
          </>
        )}
      </section>

      <div className="glass" style={{borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--glass-border)'}}>
        <div style={{position: 'relative', height: '300px'}}>
          <img src={item.imagenUrl?.startsWith('http') ? item.imagenUrl : `/${item.imagenUrl}`} alt={item.nombre} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1.5rem'}}>
             <span className="card-tag tag-mod" style={{marginBottom: '0.5rem'}}>{item.categoria}</span>
             <h1 style={{fontSize: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{item.nombre}</h1>
          </div>
        </div>

        <div style={{padding: '2rem', background: 'rgba(255,255,255,0.01)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
            <div style={{display: 'flex', gap: '2rem'}}>
               <div style={{display: 'flex', gap: '1.5rem'}}>
                  <div>
                    <small style={{display: 'block', opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase'}}>Security</small>
                    <span style={{fontWeight: '700', color: '#10b981'}}>{item.seguridad || '✅ Virus Free'}</span>
                  </div>
               </div>
               <div>
                  <small style={{display: 'block', opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase'}}>Autor</small>
                  <span style={{fontWeight: '700'}}>{item.developer || 'LootMods'}</span>
               </div>
            </div>
            <a 
              href={item.downloadUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="download-btn glow-purple" 
              style={{padding: '0.8rem 2rem', fontSize: '0.9rem'}}
              onClick={handleDownloadClick}
            >
              Download (ClaroDrive)
            </a>
          </div>

          <div className="description-section">
            <h4 style={{fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Acerca de este loot</h4>
            <p style={{lineHeight: '1.7', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
              {item.descripcion}
            </p>
          </div>

          {item.instrucciones && (
            <div style={{marginTop: '2rem', padding: '1.5rem', borderRadius: '1rem', background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.1)'}}>
              <h4 style={{fontSize: '0.8rem', color: 'var(--accent-purple)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Instrucciones de Instalación</h4>
              <p style={{fontSize: '0.9rem', opacity: 0.8}}>{item.instrucciones}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModDetails;
