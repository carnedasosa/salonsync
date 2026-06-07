import React from 'react';

export default function InventoryAlerts({ lowStockProducts }) {
  return (
    <section className="glass-card inventory-alerts-section">
      <div className="section-header">
        <h3>Scorte sotto la soglia</h3>
      </div>
      <div className="alerts-list">
        {lowStockProducts.length === 0 ? (
          <p className="empty-text">Tutti i prodotti sono a livelli ottimali.</p>
        ) : (
          lowStockProducts.map(prod => (
            <div key={prod.id} className="stock-alert-item">
              <div className="stock-alert-info">
                <p className="stock-name">{prod.name}</p>
                <p className="stock-category">{prod.category} • Prezzo retail: €{prod.price}</p>
              </div>
              <div className="stock-level-badge">
                <span className="stock-qty danger-text">{prod.stock}</span>
                <span className="stock-min">/ min {prod.minStock}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
