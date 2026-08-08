import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoot } from '../context/LootContext';


function Loot() {
  const { fullContent, fetchFullContent } = useLoot();
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [donorName, setDonorName] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [qrData, setQrData] = useState({ visible: false, img: '', name: '' });
  const navigate = useNavigate();
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
    fetchFullContent();
  }, []);

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
      if (token) headers['x-auth-token'] = token;
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

      alert(`¡Gracias ${donorName}! Redirigiendo a ${method.name}...`);
      setDonorName('');
      setSelectedAmount(null);
    } catch (err) { 
      console.error(err);
      alert(`Ocurrió un error: ${err.message}`);
    }
  };

  const filtered = (fullContent || []).filter(i => i.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="loot-container" style={{padding: '2rem 8%'}}>
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

      <h2 style={{marginBottom: '2rem', fontSize: '2.5rem'}}>Catálogo Completo</h2>
      
      <input 
        type="text" 
        placeholder="Buscar en el arsenal..." 
        className="search-input glass"
        style={{marginBottom: '1rem'}}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <section className="donation-mini-box glass glow-cyan" style={{marginBottom: '2rem'}}>
        <div className="currency-selector">
           {Object.keys(donationConfig).map(curr => (
             <button key={curr} onClick={() => { setCurrency(curr); setSelectedAmount(null); setSelectedMethod(null); }} className={currency === curr ? 'active' : ''}>{curr}</button>
           ))}
        </div>
        <h4>Ayúdanos a mantener vivo LOOTMODS / Help us keep LOOTMODS alive</h4>
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
                  style={{cursor: 'pointer', border: selectedAmount === val ? '2px solid #10b981' : '1px solid var(--glass-border)', color: '#10b981'}}
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
                style={{fontSize: '0.8rem', padding: '0.4rem 1rem', textAlign: 'center'}}
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

      <div className="loot-grid" style={{padding: '0'}}>
        {filtered.map(item => (
          <div key={item._id} className="card glass" onClick={() => navigate(`/mod/${item._id}`)} style={{cursor: 'pointer'}}>
            <img src={item.imagenUrl?.startsWith('http') ? item.imagenUrl : `/${item.imagenUrl}`} alt="" className="card-image" />
            <div className="card-content">
              <span className={`card-tag ${item.categoria === 'Mod' ? 'tag-mod' : 'tag-game'}`}>{item.categoria}</span>
              <h3>{item.nombre}</h3>
              <div style={{marginTop: '1.5rem'}}>
                <button className="download-btn glow-purple" style={{width: '100%', fontSize: '0.8rem'}}>VER DETALLES</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loot;
