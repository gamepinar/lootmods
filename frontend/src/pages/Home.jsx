import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [content, setContent] = useState([]);
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [currency, setCurrency] = useState('USD');
  const [donorName, setDonorName] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isSpanish, setIsSpanish] = useState(false);
  const [qrData, setQrData] = useState({ visible: false, img: '', name: '' });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const donationConfig = {
    USD: { 
      symbol: '$', 
      vals: [1, 5, 10, 20, 50],
      methods: [
        { id: 'binance', name: 'Binance Pay', color: '#F3BA2F' },
        { id: 'paypal', name: 'PayPal', color: '#0070BA' }
      ]
    },
    ARS: { 
      symbol: '$', 
      vals: [1000, 2000, 5000, 10000, 20000],
      methods: [
        { id: 'qr', name: 'QR Pago', color: '#009EE3' },
        { id: 'mp', name: 'Mercado Pago', color: '#00B1EA' }
      ]
    },
    BRL: { 
      symbol: 'R$', 
      vals: [2, 5, 10, 20, 50, 100],
      methods: [
        { id: 'pix', name: 'Pix', color: '#32BCAD' },
        { id: 'paypal', name: 'PayPal', color: '#0070BA' }
      ]
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setContent(data.slice(0, 5)); })
      .catch(err => console.error('Error productos:', err));

    fetch(`${API_URL}/donations/latest`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setDonations(data); })
      .catch(err => console.error('Error donadores:', err));
  }, []);

  const handlePayment = async (method) => {
    if (!donorName.trim()) {
      alert('Por favor, ingresa tu nombre para aparecer en el Muro de Honor.');
      return;
    }
    if (!selectedAmount) {
      alert('Por favor, selecciona un monto primero.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: donorName.trim(), 
          monto: selectedAmount, 
          moneda: currency,
          metodo: method.name 
        })
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

      alert(`¡Gracias ${donorName}! Redirigiendo a ${method.name}...`);
      setDonorName('');
      setSelectedAmount(null);
      
      // Recargar donadores
      const latestRes = await fetch(`${API_URL}/donations/latest`);
      const latestData = await latestRes.json();
      if (Array.isArray(latestData)) setDonations(latestData);
    } catch (err) { 
      console.error(err);
      alert(`Ocurrió un error: ${err.message}`);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || item.categoria === category;
    return matchesSearch && matchesCategory;
  });

  const getDonationTierStyle = (don) => {
    const monto = Number(don.monto);
    let isTop = false;
    let isSecond = false;
    
    if (don.moneda === 'USD') {
      if (monto >= 50) isTop = true; else if (monto >= 20) isSecond = true;
    } else if (don.moneda === 'ARS') {
      if (monto >= 20000) isTop = true; else if (monto >= 10000) isSecond = true;
    } else if (don.moneda === 'BRL') {
      if (monto >= 100) isTop = true; else if (monto >= 50) isSecond = true;
    }

    if (isTop) {
      return {
        background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0) 100%)',
        borderLeft: '4px solid #FFD700',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
        color: '#FFD700',
        padding: '1rem',
        marginBottom: '0.5rem'
      };
    }
    if (isSecond) {
      return {
        background: 'linear-gradient(90deg, rgba(209, 213, 219, 0.15) 0%, rgba(209, 213, 219, 0) 100%)',
        borderLeft: '4px solid #D1D5DB',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(209, 213, 219, 0.2)',
        color: '#D1D5DB',
        padding: '1rem',
        marginBottom: '0.5rem'
      };
    }
    return { 
      padding: '0.8rem 1rem', 
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '0.5rem'
    };
  };

  return (
    <>
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

      <header className="hero-mini">
        <h1>LOOTMODS</h1>
        <p className="hero-subtitle">The ultimate drop zone for game mods, patches, and legendary games.</p>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar loot..." 
            className="search-input glass"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <section className="donation-mini-box glass glow-cyan">
        <div className="currency-selector">
           {Object.keys(donationConfig).map(curr => (
             <button key={curr} onClick={() => { setCurrency(curr); setSelectedAmount(null); }} className={currency === curr ? 'active' : ''}>{curr}</button>
           ))}
        </div>
        <h4>Ayúdanos a mantener vivo LOOTMODS / Help us keep LOOTMODS alive</h4>
        
        <div className="donation-grid-mini">
          {donationConfig[currency].vals.map(val => (
            <button 
              key={val} 
              onClick={() => setSelectedAmount(val)} 
              className="mini-btn" 
              style={{cursor: 'pointer', border: selectedAmount === val ? '2px solid #10b981' : '1px solid var(--glass-border)', color: selectedAmount === val ? '#10b981' : '#10b981'}}
            >
              {donationConfig[currency].symbol}{val.toLocaleString()}
            </button>
          ))}
        </div>

        <div style={{marginTop: '1.2rem', padding: '0 10%'}}>
           <input 
            type="text" 
            placeholder="Name (for the Honor Wall)" 
            className="search-input glass" 
            style={{fontSize: '0.8rem', padding: '0.5rem 1rem', textAlign: 'center', border: donorName.trim() ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(168, 85, 247, 0.4)'}}
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
           />
        </div>

        {selectedAmount && (
          <div style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 5%'}}>
            <small style={{fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px'}}>Método de apoyo / Support method</small>
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

      <div className="filters-mini">
        {['All', 'Mod', 'Game', 'Tool'].map(cat => (
          <button key={cat} className={`filter-btn-mini glass ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
            {cat === 'All' ? 'Todo' : cat}
          </button>
        ))}
      </div>

      <main className="content-grid">
        {filteredContent.map((item, index) => (
          <div key={index} className="card glass" onClick={() => navigate(`/mod/${item._id}`)} style={{cursor: 'pointer'}}>
            <img src={item.imagenUrl} alt={item.nombre} className="card-image" />
            <div className="card-content">
              <span className={`card-tag ${item.categoria === 'Mod' ? 'tag-mod' : 'tag-game'}`}>{item.categoria}</span>
              <h3>{item.nombre}</h3>
              <div className="card-footer" style={{marginTop: '1rem', justifyContent: 'center'}}>
                <button className="download-btn glow-purple" style={{fontSize: '0.8rem', width: '100%'}}>VER DETALLES</button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <section style={{padding: '5rem 8%', textAlign: 'center'}}>
        <h2 style={{marginBottom: '2rem', fontSize: '2rem', color: '#10b981'}}>HONOR WALL</h2>
        <div className="glass" style={{maxWidth: '600px', margin: '0 auto', padding: '1.5rem', borderRadius: '1.5rem'}}>
          {donations.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
              {donations.map((don, i) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...getDonationTierStyle(don)}}>
                  <span style={{fontWeight: '600', color: don.monto >= 10000 || (don.moneda === 'USD' && don.monto >= 20) || (don.moneda === 'BRL' && don.monto >= 50) ? 'inherit' : '#10b981'}}>
                    {don.monto >= 20000 || (don.moneda === 'USD' && don.monto >= 50) || (don.moneda === 'BRL' && don.monto >= 100) ? '👑 ' : ''}
                    {don.monto >= 10000 && don.monto < 20000 || (don.moneda === 'USD' && don.monto >= 20 && don.monto < 50) || (don.moneda === 'BRL' && don.monto >= 50 && don.monto < 100) ? '⭐ ' : ''}
                    {don.nombre}
                  </span>
                  <span style={{fontWeight: '800'}}>
                    {don.moneda === 'BRL' ? 'R$' : '$'}{don.monto} {don.moneda}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{opacity: 0.5}}>No donations yet. Be the first!</p>
          )}
        </div>
      </section>

      <footer style={{padding: '4rem 10%', textAlign: 'center', opacity: 0.8}}>
        <div className="glass" style={{padding: '3rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative'}}>
          <button onClick={() => setIsSpanish(!isSpanish)} className="translate-btn" style={{position: 'absolute', top: '1.5rem', right: '1.5rem'}}>{isSpanish ? '🇺🇸 English' : '🇪🇸 Español'}</button>
          <h3 style={{marginBottom: '1.5rem', color: 'var(--accent-cyan)', fontSize: '1.5rem'}}>{isSpanish ? 'SOMOS GAMERS, IGUAL QUE VOS.' : 'WE ARE GAMERS, JUST LIKE YOU.'}</h3>
          <p style={{lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto'}}>
            {isSpanish ? "Creamos este espacio para preservar juegos retro y mods que ya no tienen soporte oficial ni un sitio seguro desde donde descargarlos. Nuestro objetivo es ayudar a la comunidad a acceder a contenido clásico sin enlaces caídos, páginas abandonadas o archivos riesgosos llenos de virus y malware." : "We created this space to preserve retro games and mods that no longer have official support or a safe place to download them. Our goal is to help the community access classic content without broken links, abandoned websites, or risky files filled with viruses and malware."}
          </p>
          <div style={{marginTop: '2rem', fontStyle: 'italic', color: 'var(--accent-purple)', fontWeight: '600'}}>
            {isSpanish ? "Esta plataforma fue hecha por jugadores, para jugadores, manteniendo vivos y accesibles esos juegos que todavía seguimos disfrutando." : "This platform was made by players, for players — keeping old games alive and accessible for everyone who still enjoys them."}
          </div>
        </div>
        <p style={{marginTop: '4rem', fontSize: '0.8rem', opacity: 0.4}}>© {new Date().getFullYear()} LOOTMODS - Preserving the Gaming Heritage</p>
      </footer>
    </>
  );
}

export default Home;
