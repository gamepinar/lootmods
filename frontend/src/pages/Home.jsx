import { useState, useEffect } from 'react';

function Home() {
  const [content, setContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [currency, setCurrency] = useState('USD');

  const donationAmounts = [0.50, 1, 5, 10, 20];

  const getDisplayAmount = (amt) => {
    if (currency === 'USD') return `$${amt}`;
    return `$${(amt * 2000).toLocaleString('es-AR')}`;
  };

  const mockData = [
    {
      id: 1,
      nombre: "Resident Evil 4 - HD Project",
      descripcion: "A complete graphical overhaul of the classic RE4, replacing almost every texture in the game with high-definition versions.",
      imagenUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      categoria: "Mod",
      version: "1.1",
      downloadUrl: "#"
    },
    {
      id: 2,
      nombre: "Silent Hill 2 - Enhanced Edition",
      descripcion: "The definitive way to play SH2 on PC, with widescreen support, high-res fonts, and various bug fixes.",
      imagenUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800",
      categoria: "Mod",
      version: "2.0.4",
      downloadUrl: "#"
    },
    {
      id: 4,
      nombre: "Ultimate Mods Pack - Optimization Suite",
      descripcion: "Una colección esencial de mods de optimización, corrección de errores y mejoras visuales universales. Verificado y libre de malware.",
      imagenUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800",
      categoria: "Tool",
      version: "v4.5.0",
      downloadUrl: "https://github.com/vitas/ultimate-mod-engine/releases"
    }
  ];

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    fetch(`${API_URL}/content`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContent(data.length > 0 ? data : mockData);
        } else {
          setContent(mockData);
        }
      })
      .catch(() => setContent(mockData));
  }, []);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || item.categoria === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
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
           <button onClick={() => setCurrency('USD')} className={currency === 'USD' ? 'active' : ''}>USD</button>
           <button onClick={() => setCurrency('ARS')} className={currency === 'ARS' ? 'active' : ''}>ARS</button>
        </div>
        <h4>💎 Support the Loot</h4>
        <p className="donation-subtitle">Help us keep LootMods alive / Ayúdanos a mantener vivo LootMods</p>
        <div className="donation-grid-mini">
          {donationAmounts.map(amount => (
            <a key={amount} href="#" className="mini-btn">{getDisplayAmount(amount)} <span>{currency}</span></a>
          ))}
        </div>
      </section>

      <div className="security-mini glass">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <span>ULTIMATE MODS - 100% LIBRE DE VIRUS</span>
      </div>

      <div className="filters-mini">
        {['All', 'Mod', 'Game', 'Tool'].map(cat => (
          <button 
            key={cat}
            className={`filter-btn-mini glass ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === 'All' ? 'Todo' : cat}
          </button>
        ))}
      </div>

      <main className="content-grid">
        {filteredContent.map((item, index) => (
          <div key={index} className="card glass">
            <img src={item.imagenUrl} alt={item.nombre} className="card-image" />
            <div className="card-content">
              <span className={`card-tag ${item.categoria === 'Mod' ? 'tag-mod' : 'tag-game'}`}>
                {item.categoria}
              </span>
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <div className="card-footer">
                <span className="version">v{item.version}</span>
                <a href={item.downloadUrl} className="download-btn glow-purple">Download</a>
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export default Home;
