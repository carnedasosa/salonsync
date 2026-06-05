import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, PlusCircle, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export default function CalendarView({ 
  appointments, 
  clients, 
  services, 
  staff, 
  onAddAppointment, 
  onUpdateAppointmentStatus,
  forceOpenModal,
  onResetForceOpen
}) {
  const [selectedDate, setSelectedDate] = useState('2026-06-05'); // Static "today" by default
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (forceOpenModal) {
      setIsModalOpen(true);
      if (onResetForceOpen) onResetForceOpen();
    }
  }, [forceOpenModal, onResetForceOpen]);

  
  // Form State
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [operatorId, setOperatorId] = useState(staff[0]?.id || '');
  const [time, setTime] = useState('09:00');
  const [validationError, setValidationError] = useState('');

  // Calendar parameters
  const startHour = 9; // 09:00
  const endHour = 20;  // 20:00 (grid goes up to 20:00)
  const totalMinutes = (endHour - startHour) * 60; // 660 minutes

  // Helper to parse time "HH:MM" to minutes since midnight
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Filter appointments for the selected date
  const dateAppointments = appointments.filter(app => app.date === selectedDate);

  // Position calculations for absolute grid placing
  const getPositionStyles = (timeStr, durationMinutes) => {
    const appMinutes = timeToMinutes(timeStr);
    const startMinutes = startHour * 60;
    const offsetMinutes = appMinutes - startMinutes;
    
    const topPct = (offsetMinutes / totalMinutes) * 100;
    const heightPct = (durationMinutes / totalMinutes) * 100;

    return {
      top: `${topPct}%`,
      minHeight: `max(45px, ${heightPct}%)`,
      height: 'max-content'
    };
  };

  // Handle booking form submission with conflict detection
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

    const newStartMin = timeToMinutes(time);
    const newEndMin = newStartMin + selectedService.duration;
    const newEndMinWithBuffer = newEndMin + selectedService.buffer;

    // Check for schedule overlaps with the same operator on the same day
    const hasConflict = appointments.some(app => {
      if (app.date !== selectedDate || app.operatorId !== operatorId || app.status === 'cancelled') {
        return false;
      }
      
      const appStartMin = timeToMinutes(app.time);
      const appEndMin = appStartMin + app.duration;
      const appEndMinWithBuffer = appEndMin + app.buffer;

      // Overlap detection including buffer times
      const overlap = (newStartMin < appEndMinWithBuffer && newEndMinWithBuffer > appStartMin);
      return overlap;
    });

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
      status: 'confirmed'
    };

    onAddAppointment(newAppointment);
    setIsModalOpen(false);
    
    // Reset form
    setClientId('');
    setServiceId('');
    setOperatorId(staff[0]?.id || '');
    setTime('09:00');
  };

  // Generate date options
  const dates = [
    { label: 'Oggi (5 Giu)', value: '2026-06-05' },
    { label: 'Domani (6 Giu)', value: '2026-06-06' },
    { label: 'Lunedì (8 Giu)', value: '2026-06-08' }
  ];

  return (
    <div className="calendar-tab-wrapper animate-fade-in">
      <header className="calendar-header">
        <div>
          <h2 className="gradient-text">Calendario Salone</h2>
          <p className="subtitle">Visualizza gli appuntamenti divisi per cabina/operatrice.</p>
        </div>
        <div className="calendar-controls">
          <div className="date-selector-tabs">
            {dates.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`date-tab ${selectedDate === d.value ? 'active' : ''}`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            <span>Nuova Prenotazione</span>
          </button>
        </div>
      </header>

      {/* Main Calendar Board */}
      <div className="glass-card calendar-board">
        {/* Hour markers labels on left side */}
        <div className="calendar-timeline-hours">
          <div className="hour-header-spacer">Orari</div>
          {Array.from({ length: endHour - startHour }).map((_, i) => {
            const hr = startHour + i;
            return (
              <div key={hr} className="hour-marker-label">
                {String(hr).padStart(2, '0')}:00
              </div>
            );
          })}
        </div>

        {/* Staff columns */}
        <div className="calendar-columns-grid">
          {staff.map(operator => {
            const staffAppointments = dateAppointments.filter(app => app.operatorId === operator.id);
            return (
              <div key={operator.id} className="staff-calendar-column">
                {/* Operator Header */}
                <div className="staff-column-header">
                  <div className="operator-indicator" style={{ backgroundColor: operator.color }}></div>
                  <div className="operator-details">
                    <p className="operator-name">{operator.name}</p>
                    <p className="operator-role">{operator.role}</p>
                  </div>
                </div>

                {/* Column Body Grid */}
                <div className="staff-column-body">
                  {/* Grid Lines */}
                  {Array.from({ length: endHour - startHour }).map((_, i) => (
                    <div key={i} className="hour-grid-line"></div>
                  ))}

                  {/* Absolute positioned appointments */}
                  {staffAppointments.map(app => {
                    const posStyles = getPositionStyles(app.time, app.duration);
                    const serviceColor = services.find(s => s.id === app.serviceId)?.color || 'var(--accent-primary)';
                    return (
                      <div 
                        key={app.id} 
                        className={`calendar-event-card status-${app.status}`}
                        style={{ ...posStyles, borderLeft: `4px solid ${serviceColor}` }}
                      >
                        <div className="event-time-row">
                          <Clock size={10} />
                          <span>{app.time} ({app.duration} min)</span>
                        </div>
                        <h4 className="event-client-name">{app.clientName}</h4>
                        <p className="event-service-name">{app.serviceName}</p>
                        
                        {/* Status indicators and quick complete action */}
                        <div className="event-footer">
                          {app.status === 'confirmed' ? (
                            <button 
                              className="event-complete-action" 
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateAppointmentStatus(app.id, 'completed');
                              }}
                              title="Segna come completato"
                            >
                              ✓ Completa
                            </button>
                          ) : (
                            <span className={`event-status-tag ${app.status}`}>
                              {app.status === 'completed' ? 'Eseguito' : 'No-show'}
                            </span>
                          )}
                          <span className="event-price">€{app.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Creation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nuova Prenotazione Appuntamento</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
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
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Verifica & Prenota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .calendar-tab-wrapper {
          width: 100%;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .calendar-header .subtitle {
          color: var(--text-sub);
          font-size: 0.95rem;
        }

        .calendar-controls {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .date-selector-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0.25rem;
        }

        .date-tab {
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-sub);
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .date-tab.active {
          background: var(--accent-primary);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(236, 72, 153, 0.3);
        }

        /* Calendar Grid Board */
        .calendar-board {
          display: grid;
          grid-template-columns: 80px 1fr;
          height: 680px;
          padding: 1.5rem 1rem;
          overflow-y: auto;
        }

        .calendar-timeline-hours {
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-glass);
          position: relative;
        }

        .hour-header-spacer {
          height: 50px;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border-glass);
        }

        .hour-marker-label {
          height: 50px;
          color: var(--text-sub);
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 0.5rem;
        }

        .calendar-columns-grid {
          display: flex;
          overflow-x: auto;
          flex: 1;
        }

        .staff-calendar-column {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-glass);
          background: rgba(255, 255, 255, 0.4); /* Light background for columns */
        }

        .staff-calendar-column:last-child {
          border-right: none;
        }

        .staff-column-header {
          height: 50px;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid var(--border-glass);
          position: sticky;
          top: 0;
          z-index: 20; /* Keep header above grid */
        }

        .operator-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .operator-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.2;
        }

        .operator-role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .staff-column-body {
          position: relative;
          height: calc(100% - 50px);
          background-image: linear-gradient(var(--border-glass) 1px, transparent 1px);
          background-size: 100% 50px;
        }

        .hour-grid-line {
          height: 50px;
          border-bottom: 1px dashed rgba(236, 72, 153, 0.1);
          box-sizing: border-box;
        }

        /* Event Card absolute position overlay */
        .calendar-event-card {
          position: absolute;
          left: 6px;
          right: 6px;
          background: rgba(255, 255, 255, 0.95); /* Light glass */
          backdrop-filter: blur(4px);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          z-index: 2;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .calendar-event-card:hover {
          z-index: 50; /* Bring to front */
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.2);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          height: max-content !important;
          min-height: max-content !important;
          overflow: visible;
        }

        .calendar-event-card:hover .event-client-name,
        .calendar-event-card:hover .event-service-name {
          white-space: normal;
        }

        .calendar-event-card.status-completed {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .calendar-event-card.status-no-show {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          opacity: 0.8;
        }

        .event-time-row {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: var(--text-sub);
        }

        .event-client-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-service-name {
          font-size: 0.75rem;
          color: var(--text-sub);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .event-complete-action {
          background: var(--success-glow);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 4px;
          padding: 0.15rem 0.4rem;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          transition: var(--transition);
        }

        .event-complete-action:hover {
          background: var(--success);
          color: white;
        }

        .event-status-tag {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .event-status-tag.completed {
          color: var(--success);
        }

        .event-status-tag.no-show {
          color: var(--danger);
        }

        .event-price {
          font-weight: 700;
          color: var(--text-main);
        }

        /* Modal Forms Row */
        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .alert-danger-style {
          background: var(--danger-glow);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          border-top: 1px solid var(--border-glass);
          padding-top: 1.25rem;
        }

        @media (max-width: 768px) {
          .calendar-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .calendar-controls {
            width: 100%;
            justify-content: space-between;
          }
          .calendar-board {
            height: 600px;
          }
        }
      `}</style>
    </div>
  );
}
