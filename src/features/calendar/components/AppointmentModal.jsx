import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { AppointmentStatus } from '../../../core/data/constants';
import { hasScheduleConflict } from '../calendarUtils';
import { useClients } from '../../../core/context/ClientsContext';
import { useCatalog } from '../../../core/context/CatalogContext';
import { useSalon } from '../../../core/context/SalonContext';
import { useAppointments } from '../../../core/context/AppointmentsContext';
import { useModal } from '../../../core/context/ModalContext';
import { MOCK_TODAY } from '../../../core/data/constants';

export default function AppointmentModal({
  date,
  startHour = 9,
  endHour = 20
}) {
  const { clients } = useClients();
  const { services } = useCatalog();
  const { staff } = useSalon();
  const { appointments, addAppointment } = useAppointments();
  const { closeModal } = useModal();

  const selectedDate = date || MOCK_TODAY;

  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [operatorId, setOperatorId] = useState(staff[0]?.id || '');
  const [time, setTime] = useState('09:00');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!clientId || !serviceId || !operatorId || !time) {
      setValidationError('Tutti i campi sono obbligatori.');
      return;
    }

    const selectedService = services.find(s => s.id === serviceId);
    const selectedClient = clients.find(c => c.id === clientId);
    const selectedOperator = staff.find(st => st.id === operatorId);

    // Null-guard: ensure all lookups succeeded before proceeding
    if (!selectedService || !selectedClient || !selectedOperator) {
      setValidationError('Errore interno: dati non validi. Riprova.');
      return;
    }

    const hasConflict = hasScheduleConflict({
      date: selectedDate,
      time,
      duration: selectedService.duration,
      buffer: selectedService.buffer,
      operatorId
    }, appointments);

    if (hasConflict) {
      setValidationError(`Conflitto di orario! L'operatrice ${selectedOperator.name} è occupata in quella fascia oraria (considerando anche i tempi di sanificazione).`);
      return;
    }

    // Add new appointment
    const newAppointment = {
      id: `a_${Date.now()}`,
      clientId,
      clientName: selectedClient.name,
      serviceId,
      serviceName: selectedService.name,
      operatorId,
      operatorName: selectedOperator.name,
      date: selectedDate,
      time,
      duration: selectedService.duration,
      buffer: selectedService.buffer,
      price: selectedService.price,
      status: AppointmentStatus.CONFIRMED
    };

    addAppointment(newAppointment);
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuova Prenotazione Appuntamento</h3>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {validationError && (
            <div className="alert alert-danger-style">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Seleziona Cliente</label>
            <select 
              className="form-select"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">-- Scegli un cliente --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.allergies ? `(⚠️ Allergie: ${c.allergies})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Servizio Trattamento</label>
            <select 
              className="form-select"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="">-- Scegli un servizio --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} - €{s.price} ({s.duration} min + {s.buffer} min buffer)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Estetista Operatrice</label>
              <select 
                className="form-select"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                required
              >
                <option value="">-- Scegli operatrice --</option>
                {staff.map(st => (
                  <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Orario Inizio</label>
              <select
                className="form-select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                {Array.from({ length: (endHour - startHour) * 4 }).map((_, i) => {
                  const mins = startHour * 60 + i * 15;
                  const hr = Math.floor(mins / 60);
                  const mn = mins % 60;
                  const timeString = `${String(hr).padStart(2, '0')}:${String(mn).padStart(2, '0')}`;
                  return (
                    <option key={timeString} value={timeString}>
                      {timeString}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              Verifica & Prenota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
