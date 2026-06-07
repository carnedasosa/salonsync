import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { AppointmentStatus } from '../../../core/data/constants';

export default function AppointmentsTimeline({ appointments, onUpdateAppointmentStatus }) {
  return (
    <section className="glass-card schedule-section">
      <div className="section-header">
        <h3>Appuntamenti di Oggi</h3>
        <span className="badge badge-info">{appointments.length} totali</span>
      </div>

      <div className="appointments-timeline">
        {appointments.length === 0 ? (
          <p className="empty-text">Nessun appuntamento in programma per oggi.</p>
        ) : (
          [...appointments]
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((app) => (
              <div key={app.id} className={`timeline-item status-${app.status}`}>
                <div className="app-time-col">
                  <Clock size={14} className="time-icon" />
                  <span className="app-time">{app.time}</span>
                </div>
                <div className="timeline-marker"></div>
                <div className="app-details-card">
                  <div className="app-main-info">
                    <h4>{app.clientName}</h4>
                    <p className="app-service">{app.serviceName}</p>
                  </div>
                  <div className="app-meta">
                    <span className="app-operator" style={{ backgroundColor: 'rgba(236, 72, 153, 0.05)', border: `1px solid var(--accent-primary)`, color: 'var(--accent-primary)' }}>
                      {app.operatorName}
                    </span>
                    <span className="app-price">€{app.price}</span>
                  </div>
                  <div className="app-status-actions">
                    <select 
                      className={`status-select status-badge-inline ${app.status}`}
                      value={app.status}
                      onChange={(e) => onUpdateAppointmentStatus(app.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ border: 'none', outline: 'none', cursor: 'pointer', appearance: 'auto' }}
                    >
                      <option value={AppointmentStatus.PENDING}>In attesa</option>
                      <option value={AppointmentStatus.CONFIRMED}>Confermato</option>
                      <option value={AppointmentStatus.COMPLETED}>Completato</option>
                      <option value={AppointmentStatus.NO_SHOW}>No-show</option>
                      <option value={AppointmentStatus.CANCELLED}>Cancellato</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </section>
  );
}
