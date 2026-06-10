import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { getTodayDateString } from '../../core/data/constants';
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

  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedDate]);

  // Calendar parameters
  const startHour = 9; // 09:00
  const endHour = 20;  // 20:00 (grid goes up to 20:00)

  // Generate date options
  const d1 = new Date();
  const tomorrow = new Date(d1);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDay = new Date(d1);
  nextDay.setDate(nextDay.getDate() + 2);

  const formatDateString = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTabDate = (d) => {
    const str = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'short' }).format(d);
    // Remove period at the end if present (some browsers add it for short month)
    return str.replace(/\.$/, '').replace(/^\w/, c => c.toUpperCase());
  };

  const dates = [
    { label: `Oggi (${formatTabDate(d1)})`, value: formatDateString(d1) },
    { label: `Domani (${formatTabDate(tomorrow)})`, value: formatDateString(tomorrow) },
    { label: `${formatTabDate(nextDay)}`, value: formatDateString(nextDay) }
  ];

  return (
    <div className="calendar-tab-wrapper animate-fade-in">
      <header className="calendar-header">
        <div>
          <h2 className="gradient-text">Calendario Salone</h2>
          <p className="subtitle">Visualizza gli appuntamenti divisi per cabina/operatrice.</p>
        </div>
        <div className="calendar-controls">
          <div className="date-selection-wrapper">
            <div 
              className="date-selector-tabs"
              role="group"
              aria-label="Selezione data"
            >
              {dates.map(d => {
                const isActive = selectedDate === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    ref={isActive ? activeTabRef : null}
                    aria-pressed={isActive}
                    onClick={() => setSelectedDate(d.value)}
                    className={`date-tab ${isActive ? 'active' : ''}`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
          <input 
            type="date" 
            className="date-tab-input" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1rem',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              height: '44px',
              flexShrink: 0
            }}
          />
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
