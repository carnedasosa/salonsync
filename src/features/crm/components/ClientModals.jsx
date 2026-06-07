import React, { useState } from 'react';
import { useClients } from '../../../core/context/ClientsContext';
import { useModal } from '../../../core/context/ModalContext';
import { useCatalog } from '../../../core/context/CatalogContext';
import { useSalon } from '../../../core/context/SalonContext';

export function NewClientModal({ onSuccess }) {
  const { addClient } = useClients();
  const { closeModal } = useModal();

  const INITIAL_CLIENT_FORM = {
    name: '', email: '', phone: '', birthday: '',
    skinType: 'Mista', allergies: '', notes: ''
  };
  const [newClientForm, setNewClientForm] = useState(INITIAL_CLIENT_FORM);

  const setClientField = (field) => (e) =>
    setNewClientForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientForm.name || !newClientForm.phone) return;

    const newClient = {
      id: `c_${Date.now()}`,
      name: newClientForm.name,
      email: newClientForm.email || 'Nessuna email',
      phone: newClientForm.phone,
      birthday: newClientForm.birthday || 'Non specificata',
      skinType: newClientForm.skinType,
      allergies: newClientForm.allergies || 'Nessuna',
      generalNotes: newClientForm.notes || 'Nessuna nota iniziale.',
      treatmentHistory: []
    };

    addClient(newClient);
    if (onSuccess) onSuccess(newClient.id);
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuova Scheda Cliente</h3>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>

        <form onSubmit={handleCreateClient}>
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input 
              type="text" 
              className="form-input" 
              value={newClientForm.name} 
              onChange={setClientField('name')} 
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
                value={newClientForm.phone} 
                onChange={setClientField('phone')} 
                placeholder="es. 345 123 4567"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Compleanno</label>
              <input 
                type="date" 
                className="form-input" 
                value={newClientForm.birthday} 
                onChange={setClientField('birthday')} 
              />
            </div>
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={newClientForm.email} 
                onChange={setClientField('email')} 
                placeholder="es. francesca@email.it"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo Pelle</label>
              <select 
                className="form-select" 
                value={newClientForm.skinType} 
                onChange={setClientField('skinType')}
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
              value={newClientForm.allergies} 
              onChange={setClientField('allergies')} 
              placeholder="es. Nichel, Acrilati, Acido Glicolico. Scrivere 'Nessuna' se vuoto."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preferenze del cliente (Forma unghie, temperature, massaggio...)</label>
            <textarea 
              className="form-textarea" 
              value={newClientForm.notes} 
              onChange={setClientField('notes')} 
              placeholder="es. Preferisce limatura stondata, smalti chiari n. 42. Soffre di cervicale durante il lavaggio."
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              Crea Scheda Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TreatmentRecordModal({ client }) {
  const { addTreatmentRecord } = useClients();
  const { services } = useCatalog();
  const { staff } = useSalon();
  const { closeModal } = useModal();

  const [treatServiceId, setTreatServiceId] = useState('');
  const [treatOperatorId, setTreatOperatorId] = useState(staff[0]?.id || '');
  const [treatNotes, setTreatNotes] = useState('');
  const [treatPrice, setTreatPrice] = useState('');

  if (!client) return null;

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!treatServiceId || !treatOperatorId || !treatNotes) return;

    const selectedService = services.find(s => s.id === treatServiceId);
    const selectedOperator = staff.find(st => st.id === treatOperatorId);

    if (!selectedService || !selectedOperator) return;
    
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

    addTreatmentRecord(client.id, newRecord);
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Registra Trattamento: {client.name}</h3>
          <button type="button" className="modal-close" onClick={closeModal}>×</button>
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
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              Registra nel database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
