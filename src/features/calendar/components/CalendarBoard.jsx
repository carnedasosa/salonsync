import React from 'react';
import { Clock } from 'lucide-react';
import { AppointmentStatus } from '../../../core/data/constants';
import { timeToMinutes } from '../calendarUtils';
import CustomSelect from '../../../shared/ui/CustomSelect';

export default function CalendarBoard({ staff, dateAppointments, services, startHour, endHour, onUpdateAppointmentStatus }) {
  const totalMinutes = (endHour - startHour) * 60;

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

  return (
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
                      <div className="event-footer" style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                        <div onClick={(e) => e.stopPropagation()}>
                          <CustomSelect
                            id={`status-select-${app.id}`}
                            value={app.status}
                            onChange={(val) => onUpdateAppointmentStatus(app.id, val)}
                            options={[
                              { value: AppointmentStatus.PENDING, label: 'In attesa' },
                              { value: AppointmentStatus.CONFIRMED, label: 'Confermato' },
                              { value: AppointmentStatus.COMPLETED, label: 'Eseguito' },
                              { value: AppointmentStatus.NO_SHOW, label: 'No-show' },
                              { value: AppointmentStatus.CANCELLED, label: 'Cancellato' }
                            ]}
                            placeholder="Stato"
                          />
                        </div>
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
  );
}
