import React, { useState, useEffect } from 'react';
import { Search, UserPlus, AlertTriangle, FileText, Camera, Plus, Check, Clock, ShieldAlert, Sparkles, Upload } from 'lucide-react';

export default function ClientCRM({ 
  clients, 
  services, 
  staff, 
  onAddClient, 
  onAddTreatmentRecord,
  forceOpenClientModal,
  onResetForceOpenClient
}) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAllergiesOnly, setFilterAllergiesOnly] = useState(false);

  // Client Details Modals & Forms State
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

  useEffect(() => {
    if (forceOpenClientModal) {
      setIsClientModalOpen(true);
      if (onResetForceOpenClient) onResetForceOpenClient();
    }
  }, [forceOpenClientModal, onResetForceOpenClient]);


  // New Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientBirthday, setNewClientBirthday] = useState('');
  const [newClientSkinType, setNewClientSkinType] = useState('Mista');
  const [newClientAllergies, setNewClientAllergies] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');

  // New Treatment Record Form State
  const [treatServiceId, setTreatServiceId] = useState('');
  const [treatOperatorId, setTreatOperatorId] = useState(staff[0]?.id || '');
  const [treatNotes, setTreatNotes] = useState('');
  const [treatPrice, setTreatPrice] = useState('');

  // Photo Upload Simulation State
  const [uploadingRecordId, setUploadingRecordId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get selected client object
  const client = clients.find(c => c.id === selectedClientId) || clients[0];

  // Filter client list
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery);
    const matchesAllergyFilter = !filterAllergiesOnly || (c.allergies && c.allergies.toLowerCase() !== 'nessuna');
    return matchesSearch && matchesAllergyFilter;
  });

  // Handle new client creation
  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    const newClient = {
      id: `c_${Date.now()}`,
      name: newClientName,
      email: newClientEmail || 'Nessuna email',
      phone: newClientPhone,
      birthday: newClientBirthday || 'Non specificata',
      skinType: newClientSkinType,
      allergies: newClientAllergies || 'Nessuna',
      generalNotes: newClientNotes || 'Nessuna nota iniziale.',
      treatmentHistory: []
    };

    onAddClient(newClient);
    setSelectedClientId(newClient.id);
    setIsClientModalOpen(false);

    // Reset fields
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientBirthday('');
    setNewClientSkinType('Mista');
    setNewClientAllergies('');
    setNewClientNotes('');
  };

  // Handle logging new treatment record
  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!treatServiceId || !treatOperatorId || !treatNotes) return;

    const selectedService = services.find(s => s.id === treatServiceId);
    const selectedOperator = staff.find(st => st.id === treatOperatorId);
    
    const newRecord = {
      id: `th_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      serviceName: selectedService.name,
      operatorName: selectedOperator.name,
      notes: treatNotes,
      price: Number(treatPrice) || selectedService.price,
      beforePhoto: '',
      afterPhoto: ''
    };

    onAddTreatmentRecord(client.id, newRecord);
    setIsTreatmentModalOpen(false);

    // Reset fields
    setTreatServiceId('');
    setTreatOperatorId(staff[0]?.id || '');
    setTreatNotes('');
    setTreatPrice('');
  };

  // Simulate Before/After photo upload
  const handleSimulatePhotoUpload = (recordId) => {
    setUploadingRecordId(recordId);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Assign mock photos when upload finishes
            const mockPhotos = {
              before: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&h=300&q=80',
              after: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&h=300&q=80'
            };
            
            // Trigger state change in parent (simulated update)
            const updatedHistory = client.treatmentHistory.map(rec => {
              if (rec.id === recordId) {
                return {
                  ...rec,
                  beforePhoto: mockPhotos.before,
                  afterPhoto: mockPhotos.after
                };
              }
              return rec;
            });
            
            client.treatmentHistory = updatedHistory; // local mutating for mockup reactivity
            setUploadingRecordId(null);
            setUploadProgress(0);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  return (
    <div className="crm-container animate-fade-in">
      {/* LEFT COLUMN: Client Search & Listing */}
      <aside className="crm-sidebar glass-card">
        <div className="crm-sidebar-header">
          <h3>Clienti Salone</h3>
          <button className="btn btn-primary btn-icon" onClick={() => setIsClientModalOpen(true)} title="Aggiungi Cliente">
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
                  onClick={() => setSelectedClientId(c.id)}
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

      {/* RIGHT COLUMN: Client Dossier */}
      <section className="crm-dossier">
        {!client ? (
          <div className="glass-card empty-dossier-card">
            <p>Seleziona un cliente per visualizzare la scheda tecnica e lo storico trattamenti.</p>
          </div>
        ) : (
          <div className="dossier-layout">
            
            {/* 1. Profile Summary Card */}
            <div className="glass-card dossier-header-card">
              <div className="dossier-title-row">
                <div className="dossier-avatar-large">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="dossier-name-details">
                  <h2>{client.name}</h2>
                  <p className="subtitle">Cliente registrata • Data di nascita: {client.birthday}</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsTreatmentModalOpen(true)}>
                  <Plus size={18} />
                  <span>Log Trattamento Eseguito</span>
                </button>
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
                  <button className="btn btn-secondary btn-sm" onClick={() => setIsTreatmentModalOpen(true)}>
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

                      {/* Before / After Photo Gallery Row */}
                      <div className="record-photos-area">
                        {rec.beforePhoto || rec.afterPhoto ? (
                          <div className="photos-row">
                            {rec.beforePhoto && (
                              <div className="photo-container">
                                <span className="photo-label before">PRIMA</span>
                                <img src={rec.beforePhoto} alt="Trattamento prima" />
                              </div>
                            )}
                            {rec.afterPhoto && (
                              <div className="photo-container">
                                <span className="photo-label after">DOPO</span>
                                <img src={rec.afterPhoto} alt="Trattamento dopo" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="photo-upload-simulator-placeholder">
                            {uploadingRecordId === rec.id ? (
                              <div className="upload-progress-container">
                                <div className="progress-bar-track">
                                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <span className="progress-text">Caricamento foto Prima/Dopo... {uploadProgress}%</span>
                              </div>
                            ) : (
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleSimulatePhotoUpload(rec.id)}
                              >
                                <Camera size={14} />
                                <span>Simula Caricamento Foto Trattamento</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </section>

      {/* MODAL 1: Create Client */}
      {isClientModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nuova Scheda Cliente</h3>
              <button className="modal-close" onClick={() => setIsClientModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateClient}>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newClientName} 
                  onChange={(e) => setNewClientName(e.target.value)} 
                  placeholder="es. Francesca Neri"
                  required 
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Cellulare</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={newClientPhone} 
                    onChange={(e) => setNewClientPhone(e.target.value)} 
                    placeholder="es. 345 123 4567"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Compleanno</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newClientBirthday} 
                    onChange={(e) => setNewClientBirthday(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={newClientEmail} 
                    onChange={(e) => setNewClientEmail(e.target.value)} 
                    placeholder="es. francesca@email.it"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo Pelle</label>
                  <select 
                    className="form-select" 
                    value={newClientSkinType} 
                    onChange={(e) => setNewClientSkinType(e.target.value)}
                  >
                    <option value="Mista">Mista</option>
                    <option value="Secca">Secca</option>
                    <option value="Grassa">Grassa</option>
                    <option value="Sensibile">Sensibile</option>
                    <option value="Matura">Matura</option>
                    <option value="Acneica">Acneica</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Allergie & Controindicazioni (⚠️ EVIDENZIATO NELLA SCHEDA)</label>
                <input 
                  type="text" 
                  className="form-input text-danger-input" 
                  value={newClientAllergies} 
                  onChange={(e) => setNewClientAllergies(e.target.value)} 
                  placeholder="es. Nichel, Acrilati, Acido Glicolico. Scrivere 'Nessuna' se vuoto."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferenze del cliente (Forma unghie, temperature, massaggio...)</label>
                <textarea 
                  className="form-textarea" 
                  value={newClientNotes} 
                  onChange={(e) => setNewClientNotes(e.target.value)} 
                  placeholder="es. Preferisce limatura stondata, smalti chiari n. 42. Soffre di cervicale durante il lavaggio."
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setIsClientModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Crea Scheda Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Treatment Record */}
      {isTreatmentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Registra Trattamento: {client.name}</h3>
              <button className="modal-close" onClick={() => setIsTreatmentModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddRecord}>
              <div className="form-group">
                <label className="form-label">Trattamento Eseguito</label>
                <select 
                  className="form-select" 
                  value={treatServiceId}
                  onChange={(e) => {
                    setTreatServiceId(e.target.value);
                    const selected = services.find(s => s.id === e.target.value);
                    if (selected) setTreatPrice(selected.price);
                  }}
                  required
                >
                  <option value="">-- Scegli Trattamento --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Retail €{s.price})</option>
                  ))}
                </select>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Eseguito da (Estetista)</label>
                  <select 
                    className="form-select" 
                    value={treatOperatorId}
                    onChange={(e) => setTreatOperatorId(e.target.value)}
                    required
                  >
                    <option value="">-- Seleziona Operatrice --</option>
                    {staff.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Prezzo Effettivo (€)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={treatPrice}
                    onChange={(e) => setTreatPrice(e.target.value)}
                    placeholder="Ereditato da listino"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dettagli Formula & Note Tecniche (Molto importante per il futuro!)</label>
                <textarea 
                  className="form-textarea" 
                  value={treatNotes} 
                  onChange={(e) => setTreatNotes(e.target.value)} 
                  placeholder="es. Unghie: Base Rubber + colore smalto n. 30 (2 passate) + Top Coat Matte. / Viso: Glicolico 20% tenuto in posa 4 minuti, neutralizzato."
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setIsTreatmentModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Registra nel database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .crm-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          height: calc(100vh - 120px);
          align-items: stretch;
        }

        @media (max-width: 1024px) {
          .crm-container {
            grid-template-columns: 240px 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .crm-container {
            grid-template-columns: 1fr;
            height: auto;
          }
        }

        /* CRM SIDEBAR */
        .crm-sidebar {
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          overflow-y: hidden;
        }

        .crm-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .crm-sidebar-header h3 {
          font-size: 1.15rem;
          color: var(--text-main);
        }

        .crm-search-bar {
          position: relative;
          margin-bottom: 0.75rem;
        }

        .crm-search-bar .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .crm-search-bar .form-input {
          padding-left: 2.25rem;
        }

        .crm-filter-row {
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-glass);
        }

        .allergy-filter-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: var(--text-sub);
          font-weight: 500;
        }

        .filter-warning-icon {
          color: var(--warning);
        }

        .crm-client-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .empty-search-text {
          color: var(--text-muted);
          font-size: 0.85rem;
          text-align: center;
          padding: 2rem 0;
        }

        .client-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          color: var(--text-main);
          text-align: left;
          cursor: pointer;
          transition: var(--transition);
        }

        .client-list-item:hover {
          background: rgba(255, 255, 255, 0.6);
          border-color: var(--border-glass-hover);
        }

        .client-list-item.active {
          background: rgba(236, 72, 153, 0.08);
          border-color: var(--border-glass-hover);
        }

        .client-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-deep) 0%, var(--accent-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .client-info-meta {
          flex: 1;
          min-width: 0;
        }

        .client-name-text {
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .client-phone-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .allergy-indicator-dot {
          font-size: 0.85rem;
        }

        /* CRM DOSSIER */
        .crm-dossier {
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .empty-dossier-card {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          text-align: center;
          padding: 4rem;
        }

        .dossier-layout {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .dossier-header-card {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dossier-title-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .dossier-avatar-large {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bg-space);
          font-weight: 700;
          font-size: 1.5rem;
          text-transform: uppercase;
          box-shadow: 0 0 20px rgba(199, 125, 255, 0.3);
        }

        .dossier-name-details {
          flex: 1;
        }

        .dossier-name-details h2 {
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1.2;
        }

        /* Red Allergy Banner */
        .allergy-danger-banner {
          display: flex;
          gap: 1rem;
          align-items: center;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          padding: 1rem;
          color: var(--danger);
        }

        .alert-banner-icon {
          color: var(--danger);
          flex-shrink: 0;
        }

        .alert-banner-title {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 0.15rem;
        }

        .alert-banner-desc {
          font-size: 0.85rem;
          color: var(--text-main);
        }

        /* Dossier Meta Grid */
        .dossier-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
          padding: 1.25rem 0;
        }

        .meta-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
        }

        .meta-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .text-glow .meta-value {
          color: var(--accent-primary);
          text-shadow: 0 0 8px rgba(236, 72, 153, 0.4);
        }

        .general-notes-box h4 {
          font-size: 0.95rem;
          color: var(--text-sub);
          margin-bottom: 0.5rem;
        }

        .general-notes-box p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.6);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px dashed var(--border-glass-hover);
        }

        /* TIMELINE SECTION */
        .section-title {
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
          color: var(--text-main);
        }

        .empty-history-card {
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .treatment-cards-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .treatment-record-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .record-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 0.75rem;
        }

        .record-title-group .record-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .record-title-group h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 0.15rem;
        }

        .record-meta-group {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .record-operator {
          font-size: 0.8rem;
          color: var(--text-sub);
        }

        .record-price {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--accent-glow);
        }

        /* Formula notebook card */
        .record-formula-notebook {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(236, 72, 153, 0.15);
          border-radius: var(--radius-md);
          padding: 1rem;
          font-family: monospace;
        }

        .formula-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--accent-primary);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid rgba(199, 125, 255, 0.1);
          padding-bottom: 0.25rem;
        }

        .formula-content {
          color: var(--text-main);
          font-size: 0.85rem;
          white-space: pre-line;
          line-height: 1.5;
        }

        /* Photos Area & Simulator */
        .record-photos-area {
          margin-top: 0.5rem;
        }

        .photos-row {
          display: flex;
          gap: 1.5rem;
        }

        .photo-container {
          position: relative;
          width: 180px;
          height: 135px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-glass);
        }

        .photo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-label {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          color: white;
          z-index: 1;
        }

        .photo-label.before { background: rgba(239, 68, 68, 0.85); }
        .photo-label.after { background: rgba(16, 185, 129, 0.85); }

        .photo-upload-simulator-placeholder {
          background: rgba(255,255,255,0.6);
          border: 1px dashed var(--border-glass-hover);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Progress simulator */
        .upload-progress-container {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--accent-primary);
          transition: width 0.15s ease-out;
        }

        .progress-text {
          font-size: 0.75rem;
          color: var(--text-sub);
        }

        .text-danger-input {
          border-color: rgba(239, 68, 68, 0.15);
          color: var(--danger);
        }
        .text-danger-input:focus {
          border-color: var(--danger);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }
      `}</style>
    </div>
  );
}
