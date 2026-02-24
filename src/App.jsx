import React, { useState, useEffect } from 'react';
import Scene3D from './components/Scene3D';
import './App.css';

const App = () => {
  const [config, setConfig] = useState({
    nome: 'BOBI',
    telefone: '912345678',
    forma: 'osso',
    tamanho: 'M',
    temNFC: false
  });

  const [loading, setLoading] = useState(false);
  const [stlUrl, setStlUrl] = useState(null);
  const [podeComprar, setPodeComprar] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // REGRA: Se tamanho for S, bloqueia NFC e formas complexas
  useEffect(() => {
    if (config.tamanho === 'S') {
      setConfig(prev => ({ 
        ...prev, 
        temNFC: false, 
        forma: (prev.forma === 'coracao' || prev.forma === 'circulo') ? 'osso' : prev.forma 
      }));
    }
  }, [config.tamanho]);

  const handleGerarPreview = async () => {
    setLoading(true); setStlUrl(null); setPodeComprar(false);
    try {
      const response = await fetch(`${API_URL}/gerar-tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (response.ok && data.url) { setStlUrl(data.url); setPodeComprar(true); }
    } catch (e) { alert("Erro de ligação."); }
    finally { setLoading(false); }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo-container">
          <strong style={{fontSize: '20px'}}>PP3D<span style={{color: '#3b82f6'}}>.PT</span></strong>
        </div>

        <div className="input-group">
          <label>NOME DO PET</label>
          <input type="text" maxLength={12} value={config.nome} 
            onChange={e => setConfig({...config, nome: e.target.value.toUpperCase()})} />
        </div>

        <div className="input-group">
          <label>TELEFONE (VERSO)</label>
          <input type="text" disabled={config.temNFC} 
            placeholder={config.temNFC ? "Gravado no Chip" : "Contacto"}
            value={config.telefone} onChange={e => setConfig({...config, telefone: e.target.value})} />
        </div>

        <div className="input-group">
          <label>TAMANHO</label>
          <div style={{display: 'flex', gap: '5px'}}>
            {['S', 'M', 'L'].map(t => (
              <button key={t} className={`btn-size ${config.tamanho === t ? 'active' : ''}`}
                onClick={() => setConfig({...config, tamanho: t})} style={{flex:1}}>{t}</button>
            ))}
          </div>
          <div style={{fontSize: '10px', color: '#94a3b8', marginTop: '5px', textAlign: 'center'}}>
            {config.tamanho === 'S' && "25mm x 15mm (Gatos)"}
            {config.tamanho === 'M' && "40mm x 25mm (Cães Médios)"}
            {config.tamanho === 'L' && "55mm x 35mm (Cães Grandes)"}
          </div>
        </div>

        <div className="input-group">
          <label>FORMA</label>
          <select value={config.forma} onChange={e => setConfig({...config, forma: e.target.value})}>
            <option value="osso">🦴 Osso</option>
            <option value="coracao" disabled={config.tamanho === 'S'}>❤️ Coração</option>
            <option value="circulo" disabled={config.tamanho === 'S'}>🔘 Círculo</option>
          </select>
        </div>

        <div className="input-group" style={{background: '#f1f5f9', padding: '10px', borderRadius: '8px'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0}}>
            <input type="checkbox" checked={config.temNFC} disabled={config.tamanho === 'S'}
              onChange={e => setConfig({...config, temNFC: e.target.checked})} />
            <span>ATURAR CHIP NFC</span>
          </label>
        </div>

        <button className="btn-primary" onClick={handleGerarPreview} disabled={loading} 
          style={{background: '#1e293b', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
          {loading ? 'A GERAR...' : 'VER PREVIEW 3D'}
        </button>

        {podeComprar && (
          <button className="btn-primary btn-cart" onClick={() => alert("Adicionado!")}
            style={{background: '#f59e0b', marginTop: '10px', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold'}}>
            🛒 ADICIONAR AO CARRINHO
          </button>
        )}
      </div>

      <div className="viewport">
        {loading ? (
          <div style={{textAlign: 'center'}}><div className="spinner" style={{margin: '0 auto'}}></div><p>A processar...</p></div>
        ) : stlUrl ? (
          <Scene3D stlUrl={stlUrl} />
        ) : (
          <div style={{color: '#cbd5e1', textAlign: 'center'}}><p>O modelo aparecerá aqui.</p></div>
        )}
      </div>
    </div>
  );
};

export default App;