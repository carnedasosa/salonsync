import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { AppointmentStatus } from '../../../core/data/constants';
import CustomSelect from '../../../shared/ui/CustomSelect';

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
                  <div className="app-status-actions" style={{ minWidth: '150px' }}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomSelect
                        id={`timeline-status-${app.id}`}
                        value={app.status}
                        onChange={(val) => onUpdateAppointmentStatus(app.id, val)}
                        options={[
                          { value: AppointmentStatus.PENDING, label: 'In attesa' },
                          { value: AppointmentStatus.CONFIRMED, label: 'Confermato' },
                          { value: AppointmentStatus.COMPLETED, label: 'Completato' },
                          { value: AppointmentStatus.NO_SHOW, label: 'No-show' },
                          { value: AppointmentStatus.CANCELLED, label: 'Cancellato' }
                        ]}
                        placeholder="Stato"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </section>
  );
}
