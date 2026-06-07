import React, { useState } from 'react';
import { useSalon } from '../../core/context/SalonContext';
import { Building, Users, Plus, Check } from 'lucide-react';
import './Settings.css';

// Palette di colori premium predefiniti per le operatrici
const STAFF_COLORS = [
  '#ec4899', // Rosa acceso (Primary)
  '#a855f7', // Viola
  '#8b5cf6', // Indaco
  '#3b82f6', // Blu
  '#10b981', // Smeraldo
  '#f59e0b', // Ambra
  '#f43f5e'  // Rosa intenso
];

export default function Settings() {
  const { salon, staff, addStaffMember } = useSalon();
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Estetista', color: STAFF_COLORS[0] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name.trim()) return;

    setIsSubmitting(true);
    try {
      await addStaffMember(newStaff);
      setNewStaff({ name: '', role: 'Estetista', color: STAFF_COLORS[0] });
      setIsAddingStaff(false);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'inserimento dell'operatrice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Impostazioni Salone</h1>
        <p>Gestisci i dettagli del tuo business e il team di operatrici.</p>
      </div>

      <div className="settings-grid">
        
        {/* CARD DETTAGLI SALONE */}
        <div className="settings-card">
          <h2><Building size={20} /> Profilo Salone</h2>
          {salon ? (
            <div className="salon-details">
              <div className="detail-row">
                <span className="detail-label">Nome Salone</span>
                <span className="detail-value">{salon.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{salon.email || 'Non specificata'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Telefono</span>
                <span className="detail-value">{salon.phone || 'Non specificato'}</span>
              </div>
            </div>
          ) : (
            <p>Dati salone non disponibili.</p>
          )}
        </div>

        {/* CARD GESTIONE STAFF */}
        <div className="settings-card">
          <h2><Users size={20} /> Team e Operatrici</h2>
          
          <div className="staff-header-actions">
            {!isAddingStaff && (
              <button className="btn-add-staff" onClick={() => setIsAddingStaff(true)}>
                <Plus size={20} /> Aggiungi Nuova Operatrice
              </button>
            )}
          </div>

          {staff.length > 0 ? (
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ruolo</th>
                  <th>Colore Calendario</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member.id}>
                    <td data-label="Nome"><strong>{member.name}</strong></td>
                    <td data-label="Ruolo">{member.role}</td>
                    <td data-label="Colore Calendario">
                      <div className="staff-badge" style={{ backgroundColor: `${member.color}15`, color: member.color }}>
                        <div className="color-dot" style={{ backgroundColor: member.color }}></div>
                        {member.color}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Non hai ancora aggiunto nessuna operatrice al team.</p>
          )}

          {/* FORM AGGIUNTA STAFF */}
          {isAddingStaff && (
            <div className="add-staff-form">
              <h3>Nuova Operatrice</h3>
              <form onSubmit={handleAddStaff}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Es. Martina"
                      value={newStaff.name}
                      onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ruolo</label>
                    <select 
                      value={newStaff.role}
                      onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                    >
                      <option value="Estetista">Estetista</option>
                      <option value="Onicotecnica">Onicotecnica</option>
                      <option value="Lash Maker">Lash Maker</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Titolare">Titolare</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Colore Assegnato (Visibile nel Calendario)</label>
                  <div className="color-palette">
                    {STAFF_COLORS.map(color => (
                      <div 
                        key={color}
                        className={`color-option ${newStaff.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewStaff({...newStaff, color})}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsAddingStaff(false)}>
                    Annulla
                  </button>
                  <button type="submit" className="btn-confirm" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvataggio...' : 'Conferma Nuova Operatrice'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
