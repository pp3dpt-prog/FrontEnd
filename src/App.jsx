import React, { useState, useEffect } from 'react';
import Scene3D from './components/Scene3D';
import './App.css'; // Importa o novo CSS

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

  // REGRA: S não pode ter NFC e certas formas
  useEffect(() => {
    if (config.tamanho === 'S') {
      let novaForma = config.forma;
      // Se for S e estiver em Coração/Círculo, volta para Osso
      if (config.forma === 'coracao' || config.forma === 'circulo') {
        novaForma = 'osso';
      }
      setConfig(prev => ({ ...prev, temNFC: false, forma: novaForma }));
    }
  }, [config.tamanho]);

  const handleGerarPreview = async () => {
    setLoading(true);
    setStlUrl(null);
    setPodeComprar(false);
    try {
      const response = await fetch(`${API_URL}/gerar-tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (response.ok && data.url) {
        setStlUrl(data.url);
        setPodeComprar(true);
      } else {
        alert("Erro ao gerar modelo.");
      }
    } catch (e) {
      alert("Erro de ligação.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarAoCarrinho = () => {
    console.log("Adicionado:", config);
    alert(`Sucesso! A medalha do ${config.nome} foi guardada.`);
  };

  return (
  <div className="app-container">
    {/* COLUNA DE CONTROLOS */}
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-text">PP3D<span className="logo-accent">.PT</span></div>
        <p style={{fontSize: '10px', color: '#a0aec0', margin: 0}}>PERSONALIZAÇÃO 3D PROFISSIONAL</p>
      </div>

      <div className="input-group">
        <label>NOME DO PET</label>
        <input 
          type="text" 
          value={config.nome} 
          onChange={e => setConfig({...config, nome: e.target.value.toUpperCase()})}
        />
      </div>

      <div className="input-group">
        <label>TAMANHO</label>
        <div className="size-grid" style={{display: 'flex', gap: '10px'}}>
          {['S', 'M', 'L'].map(t => (
            <button 
              key={t} 
              className={`btn-size ${config.tamanho === t ? 'active' : ''}`}
              onClick={() => setConfig({...config, tamanho: t})}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Medidas dinâmicas conforme o tamanho */}
        <div className="size-info">
          {config.tamanho === 'S' && "Medida: 25mm x 15mm | Ideal para Gatos/Cães Mini"}
          {config.tamanho === 'M' && "Medida: 40mm x 25mm | Ideal para Cães Médios"}
          {config.tamanho === 'L' && "Medida: 55mm x 35mm | Ideal para Cães Grandes"}
        </div>
      </div>

      <div className="input-group">
        <label>FORMA</label>
        <select value={config.forma} onChange={e => setConfig({...config, forma: e.target.value})}>
          <option value="osso">🦴 Osso Clássico</option>
          <option value="coracao" disabled={config.tamanho === 'S'}>❤️ Coração</option>
          <option value="circulo" disabled={config.tamanho === 'S'}>🔘 Círculo</option>
        </select>
      </div>

      <button className="btn-primary" onClick={handleGerarPreview} disabled={loading}>
        {loading ? 'A PROCESSAR...' : 'VER PREVIEW 3D'}
      </button>

      {podeComprar && (
        <button className="btn-primary btn-cart" onClick={handleAdicionarAoCarrinho}>
          🛒 ADICIONAR AO CARRINHO
        </button>
      )}
    </div>

    {/* COLUNA DO VISUALIZADOR */}
    <div className="viewport">
      {loading ? (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>A desenhar a tua peça...</p>
        </div>
      ) : stlUrl ? (
        <Scene3D stlUrl={stlUrl} />
      ) : (
        <div style={{color: '#a0aec0', textAlign: 'center'}}>
          <p>Selecione as opções para visualizar o modelo real.</p>
        </div>
      )}
    </div>
  </div>
);
}

export default App;