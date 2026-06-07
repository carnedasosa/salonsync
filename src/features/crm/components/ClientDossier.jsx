import React from 'react';
import { Plus, ShieldAlert, FileText, Trash2 } from 'lucide-react';
import { useModal } from '../../../core/context/ModalContext';
import { useClients } from '../../../core/context/ClientsContext';

export default function ClientDossier({ client, setShowDossierMobile, setSelectedClientId }) {
  const { openModal } = useModal();
  const { deleteClient } = useClients();

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare definitivamente questo cliente e tutto il suo storico trattamenti? Questa azione non può essere annullata.")) {
      try {
        await deleteClient(client.id);
        setSelectedClientId(null);
        setShowDossierMobile(false);
      } catch (err) {
        alert("Errore durante l'eliminazione: " + err.message);
      }
    }
  };
  if (!client) {
    return (
      <section className="crm-dossier">
        <div className="glass-card empty-dossier-card">
          <p>Seleziona un cliente per visualizzare la scheda tecnica e lo storico trattamenti.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="crm-dossier">
      <div className="dossier-layout">
        
        {/* 1. Profile Summary Card */}
        <div className="glass-card dossier-header-card">
          <div className="dossier-title-row">
            <button className="btn btn-secondary back-to-list-btn" onClick={() => setShowDossierMobile(false)}>
              ← Lista Clienti
            </button>
            <div className="dossier-avatar-large">
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="dossier-name-details">
              <h2>{client.name}</h2>
              <p className="subtitle">Cliente registrata • Data di nascita: {client.birthday}</p>
            </div>
            <div className="dossier-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={() => openModal('TREATMENT_RECORD', { client })}>
                <Plus size={18} />
                <span>Log Trattamento Eseguito</span>
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleDelete}
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', background: 'rgba(239, 68, 68, 0.05)' }}
                title="Elimina Cliente"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Allergy Warning Glass Banner (If any allergies exist) */}
          {client.allergies && client.allergies.toLowerCase() !== 'nessuna' && (
            <div className="allergy-danger-banner">
              <ShieldAlert className="alert-banner-icon animate-pulse" size={24} />
              <div>
                <h4 className="alert-banner-title">⚠️ ALLERGIE E CONTROINDICAZIONI REGISTRATE</h4>
                <p className="alert-banner-desc">{client.allergies}</p>
              </div>
            </div>
          )}

          {/* Contact and Technical Meta Grid */}
          <div className="dossier-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Telefono</span>
              <span className="meta-value">{client.phone}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Email</span>
              <span className="meta-value">{client.email}</span>
            </div>
            <div className="meta-box text-glow">
              <span className="meta-label">Tipo di Pelle</span>
              <span className="meta-value">{client.skinType}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Ultima Visita</span>
              <span className="meta-value">
                {client.treatmentHistory[0]?.date || 'Nessun trattamento loggato'}
              </span>
            </div>
          </div>

          <div className="general-notes-box">
            <h4>Preferenze & Note Generali del Cliente</h4>
            <p>{client.generalNotes}</p>
          </div>
        </div>

        {/* 2. Visual Timeline & Formula History */}
        <div className="dossier-timeline-section">
          <h3 className="section-title">Storico Trattamenti & Formule Tecniche</h3>
          
          {client.treatmentHistory.length === 0 ? (
            <div className="glass-card empty-history-card">
              <p className="empty-text">Nessun trattamento registrato nel database per questa cliente.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => openModal('TREATMENT_RECORD', { client })}>
                Aggiungi il primo trattamento ora
              </button>
            </div>
          ) : (
            <div className="treatment-cards-list">
              {client.treatmentHistory.map((rec) => (
                <div key={rec.id} className="glass-card treatment-record-card">
                  <div className="record-card-header">
                    <div className="record-title-group">
                      <span className="record-date">{rec.date}</span>
                      <h4>{rec.serviceName}</h4>
                    </div>
                    <div className="record-meta-group">
                      <span className="record-operator">Eseguito da: <strong>{rec.operatorName}</strong></span>
                      <span className="record-price">€{rec.price}</span>
                    </div>
                  </div>

                  {/* Technical Formula Notebook style */}
                  <div className="record-formula-notebook">
                    <div className="formula-header">
                      <FileText size={14} className="formula-icon" />
                      <span>SCHEDA TECNICA & FORMULA</span>
                    </div>
                    <p className="formula-content">{rec.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
