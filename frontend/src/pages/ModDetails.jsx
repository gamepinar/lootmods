import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ModDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [donorName, setDonorName] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [qrData, setQrData] = useState({ visible: false, img: '', name: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const donationConfig = {
    USD: { 
      symbol: '$', vals: [1, 5, 10, 20, 50],
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
    },
    BRL: { 
      symbol: 'R$', vals: [2, 5, 10, 20, 50, 100],
      methods: [
        { id: 'pix', name: 'Pix', color: '#32BCAD' },
        { id: 'paypal', name: 'PayPal', color: '#0070BA' }
      ]
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/content/${id}`)
      .then(res => res.json())
      .then(data => setItem(data))
      .catch(err => console.error(err));
  }, [id]);

  const handlePayment = async (method) => {
    if (!donorName.trim()) {
      alert('Por favor, ingresa tu nombre para aparecer en el Muro de Honor.');
      return;
    }
    if (!selectedAmount) {
      alert('Por favor, selecciona un monto.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      if (resData.urlCheckout) {
        alert(`¡Gracias ${donorName}! Redirigiendo a la pasarela de pago segura...`);
        window.location.href = resData.urlCheckout;
        return;
      }

      alert(`¡Gracias ${donorName}! Redirigiendo a ${method.name}...`);
      setDonorName('');
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
              <br />Una vez verificado, aparecerás en el Muro de Honor.
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

      <section className="donation-mini-box glass glow-cyan" style={{marginBottom: '2rem', padding: '1.5rem'}}>
        <div className="currency-selector">
           {Object.keys(donationConfig).map(curr => (
             <button key={curr} onClick={() => { setCurrency(curr); setSelectedAmount(null); }} className={currency === curr ? 'active' : ''} style={{fontSize: '0.65rem'}}>{curr}</button>
           ))}
        </div>
        <h4 style={{fontSize: '0.85rem'}}>Ayúdanos a mantener vivo LOOTMODS / Help us keep LOOTMODS alive</h4>
        <div className="donation-grid-mini">
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
        <div style={{marginTop: '1.2rem', padding: '0 15%'}}>
           <input 
            type="text" 
            placeholder="Name (for the Honor Wall)" 
            className="search-input glass" 
            style={{fontSize: '0.75rem', padding: '0.4rem 1rem', textAlign: 'center'}}
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
           />
        </div>

        {selectedAmount && (
          <div style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 10%'}}>
            <small style={{fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase'}}>Método de apoyo / Support method</small>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center'}}>
               {donationConfig[currency].methods.map(method => (
                 <button 
                  key={method.id} 
                  onClick={() => handlePayment(method)}
                  className="mini-btn"
                  style={{fontSize: '0.7rem', border: `1px solid ${method.color}88`, background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem'}}
                 >
                   <span style={{color: method.color, opacity: 1, fontSize: '0.75rem'}}>{method.name}</span>
                 </button>
               ))}
            </div>
          </div>
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
            <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className="download-btn glow-purple" style={{padding: '0.8rem 2rem', fontSize: '0.9rem'}}>
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
