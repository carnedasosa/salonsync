import React, { useState } from 'react';
import { useCatalog } from '../../../core/context/CatalogContext';
import { useModal } from '../../../core/context/ModalContext';
import CustomSelect from '../../../shared/ui/CustomSelect';

export function NewServiceModal() {
  const { addService } = useCatalog();
  const { closeModal } = useModal();

  const [servName, setServName] = useState('');
  const [servCategory, setServCategory] = useState('Unghie');
  const [servPrice, setServPrice] = useState('');
  const [servDuration, setServDuration] = useState('');
  const [servBuffer, setServBuffer] = useState('10');

  const handleCreateService = (e) => {
    e.preventDefault();
    if (!servName || !servPrice || !servDuration) return;

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
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Aggiungi Nuovo Trattamento a Listino</h3>
          <button type="button" className="modal-close" onClick={closeModal}>×</button>
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
              <label htmlFor="service-category" className="form-label">Categoria</label>
              <CustomSelect
                id="service-category"
                value={servCategory}
                onChange={setServCategory}
                options={[
                  { value: 'Unghie', label: 'Unghie' },
                  { value: 'Viso', label: 'Viso' },
                  { value: 'Corpo', label: 'Corpo' },
                  { value: 'Sguardo', label: 'Sguardo' }
                ]}
                placeholder="-- Categoria --"
              />
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
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              Aggiungi a Listino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewProductModal() {
  const { addProduct } = useCatalog();
  const { closeModal } = useModal();

  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Unghie');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodMinStock, setProdMinStock] = useState('');

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
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Inserisci Nuovo Prodotto in Inventario</h3>
          <button type="button" className="modal-close" onClick={closeModal}>×</button>
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
              <label htmlFor="product-category" className="form-label">Categoria</label>
              <CustomSelect
                id="product-category"
                value={prodCategory}
                onChange={setProdCategory}
                options={[
                  { value: 'Unghie', label: 'Unghie' },
                  { value: 'Viso', label: 'Viso' },
                  { value: 'Corpo', label: 'Corpo' },
                  { value: 'Sguardo', label: 'Sguardo' }
                ]}
                placeholder="-- Categoria --"
              />
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
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              Registra Prodotto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
