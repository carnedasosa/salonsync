import React from 'react';
import { Search, UserPlus, ShieldAlert } from 'lucide-react';
import { useModal } from '../../../core/context/ModalContext';

export default function ClientSidebar({
  searchQuery,
  setSearchQuery,
  filterAllergiesOnly,
  setFilterAllergiesOnly,
  filteredClients,
  client,
  setSelectedClientId,
  setShowDossierMobile
}) {
  const { openModal } = useModal();

  return (
    <aside className="crm-sidebar glass-card">
      <div className="crm-sidebar-header">
        <h3>Clienti Salone</h3>
        <button className="btn btn-primary btn-icon" onClick={() => openModal('NEW_CLIENT', { onSuccess: (id) => setSelectedClientId(id) })} title="Aggiungi Cliente">
          <UserPlus size={18} />
        </button>
      </div>

      <div className="crm-search-bar">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Cerca per nome o cell..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Allergy Safety Filter */}
      <div className="crm-filter-row">
        <label className="allergy-filter-checkbox">
          <input 
            type="checkbox"
            checked={filterAllergiesOnly}
            onChange={(e) => setFilterAllergiesOnly(e.target.checked)}
          />
          <ShieldAlert size={14} className="filter-warning-icon" />
          <span>Mostra solo con allergie</span>
        </label>
      </div>

      {/* Client List Scrollable */}
      <div className="crm-client-list">
        {filteredClients.length === 0 ? (
          <p className="empty-search-text">Nessun cliente trovato.</p>
        ) : (
          filteredClients.map(c => {
            const hasAllergies = c.allergies && c.allergies.toLowerCase() !== 'nessuna';
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedClientId(c.id);
                  setShowDossierMobile(true);
                }}
                className={`client-list-item ${client?.id === c.id ? 'active' : ''}`}
              >
                <div className="client-avatar">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="client-info-meta">
                  <p className="client-name-text">{c.name}</p>
                  <p className="client-phone-text">{c.phone}</p>
                </div>
                {hasAllergies && (
                  <span className="allergy-indicator-dot" title="Allergico / Sensibile">⚠️</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
