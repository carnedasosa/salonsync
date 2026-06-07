import React, { useState, useMemo } from 'react';
import { Sparkles, DollarSign, Clock, ShieldAlert, ShoppingBag, Plus, Search, Tag, AlertTriangle, Layers } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export default function Catalog() {
  const { services, products, addService, addProduct, updateStock } = useCatalog();
  const [activeSubTab, setActiveSubTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // New Service Form State
  const [servName, setServName] = useState('');
  const [servCategory, setServCategory] = useState('Unghie');
  const [servPrice, setServPrice] = useState('');
  const [servDuration, setServDuration] = useState('');
  const [servBuffer, setServBuffer] = useState('10');

  // New Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Unghie');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodMinStock, setProdMinStock] = useState('');

  // Filtering lists — memoised to avoid recomputing on every render
  const filteredServices = useMemo(() =>
    services.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [services, searchTerm]
  );

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]
  );

  // Handlers
  const handleCreateService = (e) => {
    e.preventDefault();
    if (!servName || !servPrice || !servDuration) return;

    // Pick random pastel color for calendar background
    const colors = ['#e0aaff', '#c77dff', '#9d4edd', '#7b2cbf', '#ff70a6', '#70d6ff', '#ff9770'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newService = {
      id: `s_${Date.now()}`,
      name: servName,
      category: servCategory,
      price: Number(servPrice),
      duration: Number(servDuration),
      buffer: Number(servBuffer),
      color: randomColor
    };

    addService(newService);
    setIsServiceModalOpen(false);
    
    // Reset
    setServName('');
    setServPrice('');
    setServDuration('');
    setServBuffer('10');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock || !prodMinStock) return;

    const newProduct = {
      id: `p_${Date.now()}`,
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      stock: Number(prodStock),
      minStock: Number(prodMinStock)
    };

    addProduct(newProduct);
    setIsProductModalOpen(false);

    // Reset
    setProdName('');
    setProdPrice('');
    setProdStock('');
    setProdMinStock('');
  };

  return (
    <div className="catalog-tab-wrapper animate-fade-in">
      <header className="catalog-header">
        <div>
          <h2 className="gradient-text">Listino & Magazzino</h2>
          <p className="subtitle">Gestisci i trattamenti offerti dal salone e monitora le scorte dei prodotti.</p>
        </div>
        
        {/* Toggle subtabs */}
        <div className="subtab-selector">
          <button 
            className={`subtab-btn ${activeSubTab === 'services' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('services'); setSearchTerm(''); }}
          >
            <Layers size={16} />
            <span>Listino Servizi</span>
          </button>
          <button 
            className={`subtab-btn ${activeSubTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('products'); setSearchTerm(''); }}
          >
            <ShoppingBag size={16} />
            <span>Magazzino Prodotti</span>
          </button>
        </div>
      </header>

      {/* SEARCH AND ADD BAR */}
      <div className="catalog-actions-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder={activeSubTab === 'services' ? "Cerca trattamenti..." : "Cerca prodotti..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        
        {activeSubTab === 'services' ? (
          <button className="btn btn-primary" onClick={() => { setIsServiceModalOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Plus size={16} />
            <span>Nuovo Trattamento</span>
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => { setIsProductModalOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Plus size={16} />
            <span>Nuovo Prodotto</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT: SERVICES */}
      {activeSubTab === 'services' && (
        <div className="glass-card catalog-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Trattamento</th>
                  <th>Categoria</th>
                  <th>Prezzo Listino</th>
                  <th>Durata Cabina</th>
                  <th>Tempo Sanificazione</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-cell">Nessun servizio registrato.</td>
                  </tr>
                ) : (
                  filteredServices.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="service-name-cell">
                          <div className="service-color-dot" style={{ backgroundColor: s.color }}></div>
                          <span className="service-title-text">{s.name}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-info">{s.category}</span></td>
                      <td><strong className="text-glow-alt">€{s.price}</strong></td>
                      <td>
                        <div className="time-cell">
                          <Clock size={14} className="cell-icon" />
                          <span>{s.duration} min</span>
                        </div>
                      </td>
                      <td>
                        <span className="buffer-badge">+{s.buffer} min buffer</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRODUCTS */}
      {activeSubTab === 'products' && (
        <div className="glass-card catalog-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Prodotto</th>
                  <th>Categoria</th>
                  <th>Prezzo Vendita</th>
                  <th>Stato Scorte</th>
                  <th style={{ textAlign: 'right' }}>Azioni Rapide Scorte</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-cell">Nessun prodotto in magazzino.</td>
                  </tr>
                ) : (
                  filteredProducts.map(p => {
                    const isLow = p.stock <= p.minStock;
                    return (
                      <tr key={p.id} className={isLow ? 'row-warning-style' : ''}>
                        <td>
                          <div className="product-title-group">
                            <span className="product-title-text">{p.name}</span>
                            {isLow && (
                              <span className="stock-alert-pill">
                                <AlertTriangle size={10} />
                                <span>Sotto scorta</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td><span className="badge badge-secondary">{p.category}</span></td>
                        <td><strong>€{p.price.toFixed(2)}</strong></td>
                        <td>
                          <div className="stock-status-cell">
                            <span className={`stock-number ${isLow ? 'danger-text' : 'success-text'}`}>
                              {p.stock}
                            </span>
                            <span className="stock-threshold">/ min {p.minStock}</span>
                          </div>
                        </td>
                        <td>
                          <div className="stock-actions-cell">
                            <button 
                              className="stock-adjust-btn sell"
                              onClick={() => updateStock(p.id, -1)}
                              disabled={p.stock <= 0}
                              title="Registra vendita (-1 scorta)"
                            >
                              Vendi 1
                            </button>
                            <button 
                              className="stock-adjust-btn restock"
                              onClick={() => updateStock(p.id, 5)}
                              title="Rifornisci magazzino (+5 scorte)"
                            >
                              +5 Rifornisci
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Create Service */}
      {isServiceModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Aggiungi Nuovo Trattamento a Listino</h3>
              <button className="modal-close" onClick={() => setIsServiceModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateService}>
              <div className="form-group">
                <label className="form-label">Nome Trattamento</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={servName}
                  onChange={(e) => setServName(e.target.value)}
                  placeholder="es. Laminazione Ciglia Superiori"
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select 
                    className="form-select"
                    value={servCategory}
                    onChange={(e) => setServCategory(e.target.value)}
                  >
                    <option value="Unghie">Unghie</option>
                    <option value="Viso">Viso</option>
                    <option value="Corpo">Corpo</option>
                    <option value="Sguardo">Sguardo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Prezzo (€)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={servPrice}
                    onChange={(e) => setServPrice(e.target.value)}
                    placeholder="es. 45"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Durata in Cabina (Minuti)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={servDuration}
                    onChange={(e) => setServDuration(e.target.value)}
                    placeholder="es. 60"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Buffer Sanificazione (Minuti)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={servBuffer}
                    onChange={(e) => setServBuffer(e.target.value)}
                    placeholder="Tempo per pulire la postazione"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setIsServiceModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Aggiungi a Listino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Product */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Inserisci Nuovo Prodotto in Inventario</h3>
              <button className="modal-close" onClick={() => setIsProductModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Nome Prodotto</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="es. Crema Idratante Acido Ialuronico 50ml"
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select 
                    className="form-select"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                  >
                    <option value="Unghie">Unghie</option>
                    <option value="Viso">Viso</option>
                    <option value="Corpo">Corpo</option>
                    <option value="Sguardo">Sguardo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Prezzo Vendita (€)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="es. 19.90"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Giacenza Iniziale (Scorte)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="Quanti pezzi hai adesso?"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Soglia Minima (Allerta scorta)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={prodMinStock}
                    onChange={(e) => setProdMinStock(e.target.value)}
                    placeholder="Sotto questo valore scatta l'allerta"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setIsProductModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Registra Prodotto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .catalog-tab-wrapper {
          width: 100%;
        }

        .catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .catalog-header .subtitle {
          color: var(--text-sub);
          font-size: 0.95rem;
        }

        .subtab-selector {
          display: flex;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0.25rem;
          gap: 0.25rem;
        }

        .subtab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-sub);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .subtab-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          box-shadow: 0 2px 5px rgba(236, 72, 153, 0.3);
        }

        .catalog-actions-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 2rem;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 350px;
        }

        .search-box .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-box .form-input {
          padding-left: 2.25rem;
        }

        .empty-table-cell {
          text-align: center;
          color: var(--text-muted);
          padding: 3rem 0;
          font-style: italic;
        }

        .service-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .service-color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .service-title-text {
          font-weight: 600;
          color: var(--text-main);
        }

        .text-glow-alt {
          color: var(--accent-glow);
          font-family: var(--font-display);
        }

        .time-cell {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-sub);
        }

        .cell-icon {
          color: var(--accent-primary);
        }

        .buffer-badge {
          font-size: 0.75rem;
          color: var(--accent-deep);
          background: rgba(236, 72, 153, 0.05);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px dashed var(--accent-primary);
        }

        /* Products table specifics */
        .product-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .product-title-text {
          font-weight: 600;
        }

        .stock-alert-pill {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--danger);
          background: var(--danger-glow);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .row-warning-style td {
          background: rgba(239, 68, 68, 0.01);
        }

        .stock-status-cell {
          display: flex;
          align-items: baseline;
          gap: 0.15rem;
        }

        .stock-number {
          font-size: 1.1rem;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .stock-number.success-text {
          color: var(--success);
        }

        .stock-number.danger-text {
          color: var(--danger);
        }

        .stock-threshold {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .stock-actions-cell {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .stock-adjust-btn {
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: var(--transition);
        }

        .stock-adjust-btn.sell {
          background: rgba(255, 255, 255, 0.8);
          border-color: var(--border-glass-hover);
          color: var(--text-main);
        }

        .stock-adjust-btn.sell:hover:not(:disabled) {
          background: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 2px 5px rgba(236, 72, 153, 0.15);
        }

        .stock-adjust-btn.sell:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .stock-adjust-btn.restock {
          background: var(--success-glow);
          border-color: rgba(16, 185, 129, 0.2);
          color: var(--success);
        }

        .stock-adjust-btn.restock:hover {
          background: var(--success);
          color: white;
        }

        @media (max-width: 768px) {
          .catalog-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .subtab-selector {
            width: 100%;
          }
          .subtab-btn {
            flex: 1;
            justify-content: center;
          }
          .catalog-actions-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .search-box {
            max-width: 100%;
          }
          .stock-actions-cell {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
