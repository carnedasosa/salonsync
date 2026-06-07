import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { MOCK_TODAY } from '../../core/data/constants';
import { useClients } from '../../core/context/ClientsContext';
import { useCatalog } from '../../core/context/CatalogContext';
import { useSalon } from '../../core/context/SalonContext';
import { useModal } from '../../core/context/ModalContext';
import CalendarBoard from './components/CalendarBoard';
import { useCalendarAppointments } from './hooks/useCalendarAppointments';
import './Calendar.css';

export default function CalendarView({
  onUpdateAppointmentStatus,
}) {
  const { staff } = useSalon();
  const { openModal } = useModal();
  const { services } = useCatalog();
  
  const {
    appointments,
    dateAppointments,
    addAppointment,
    selectedDate,
    setSelectedDate
  } = useCalendarAppointments();

  // Calendar parameters
  const startHour = 9; // 09:00
  const endHour = 20;  // 20:00 (grid goes up to 20:00)

  // Generate date options
  const dates = [
    { label: 'Oggi (5 Giu)', value: MOCK_TODAY },
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
          <button className="btn btn-primary" onClick={() => openModal('NEW_APPOINTMENT', { date: selectedDate })}>
            <PlusCircle size={18} />
            <span>Nuova Prenotazione</span>
          </button>
        </div>
      </header>

      <CalendarBoard 
        staff={staff}
        dateAppointments={dateAppointments}
        services={services}
        startHour={startHour}
        endHour={endHour}
        onUpdateAppointmentStatus={onUpdateAppointmentStatus}
      />
    </div>
  );
}
