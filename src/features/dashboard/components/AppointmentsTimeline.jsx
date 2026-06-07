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
                    {app.status === AppointmentStatus.CONFIRMED ? (
                      <button 
                        className="status-action-btn complete-btn" 
                        title="Segna come completato"
                        onClick={() => onUpdateAppointmentStatus(app.id, AppointmentStatus.COMPLETED)}
                      >
                        <CheckCircle size={16} />
                        <span>Completa</span>
                      </button>
                    ) : (
                      <span className={`status-badge-inline ${app.status}`}>
                        {app.status === AppointmentStatus.COMPLETED ? 'Completato' : 'No-show'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </section>
  );
}
