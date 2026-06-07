/**
 * AppLayout.jsx
 * Gestisce il layout principale, il routing tra i tab e la logica
 * cross-context (es. completamento appuntamento → aggiornamento CRM).
 *
 * Ha accesso a tutti i context e funge da "connettore" tra di essi.
 * I componenti tab ricevono solo i prop strettamente necessari per
 * la coordinazione UI — tutti i DATI vengono consumati direttamente
 * dai context tramite hook.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../../features/dashboard/Dashboard';
import CalendarView from '../../features/calendar/CalendarView';
import ClientCRM from '../../features/crm/ClientCRM';
import Catalog from '../../features/catalog/Catalog';
import ErrorBoundary from '../../shared/ui/ErrorBoundary';
import Onboarding from '../../features/onboarding/Onboarding';
import Settings from '../../features/settings/Settings';
import GlobalModals from './GlobalModals';

import { useSalon } from '../context/SalonContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useClients } from '../context/ClientsContext';
import { AppointmentStatus } from '../data/constants';
import { shouldAutoRecordTreatment, createTreatmentRecord } from '../../features/crm/crmUtils';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef(null);

  // Context hooks necessari per la logica cross-context
  const { salon, isLoading: isSalonLoading } = useSalon();
  const { appointments, updateAppointmentStatus } = useAppointments();
  const { clients, addTreatmentRecord } = useClients();

  // Resetta scroll quando si cambia tab (location)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  /**
   * Handler cross-context: aggiorna lo status dell'appuntamento E,
   * se completato, crea automaticamente un record nello storico
   * trattamenti del cliente corrispondente nel CRM.
   */
  const handleUpdateAppointmentStatus = (appId, newStatus) => {
    updateAppointmentStatus(appId, newStatus);

    if (newStatus === AppointmentStatus.COMPLETED) {
      const app = appointments.find((a) => a.id === appId);
      if (!app) return;

      if (shouldAutoRecordTreatment(appId, app.clientId, clients)) {
        addTreatmentRecord(app.clientId, createTreatmentRecord(app));
      }
    }
  };

  if (isSalonLoading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Caricamento...</div>;
  }

  if (!salon) {
    return <Onboarding />;
  }

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content" ref={mainContentRef}>
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <Dashboard
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              />
            } />

            <Route path="/calendar" element={
              <CalendarView
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              />
            } />

            <Route path="/crm" element={<ClientCRM />} />

            <Route path="/catalog" element={<Catalog />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <GlobalModals />
    </div>
  );
}
