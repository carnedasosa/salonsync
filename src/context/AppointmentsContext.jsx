/**
 * AppointmentsContext.jsx
 * Gestisce lo stato degli appuntamenti e lo storico ricavi mensili.
 * Nota: questo context si occupa SOLO dei propri dati. La logica
 * cross-context (es. creare automaticamente un record trattamento
 * quando un appuntamento viene completato) è delegata ad AppLayout,
 * che ha accesso a tutti i context.
 */
import React, { createContext, useContext } from 'react';
import { mockAppointments, mockRevenueHistory } from '../data/mockData';
import { MOCK_TODAY } from '../data/constants';
import useLocalStorage from '../hooks/useLocalStorage';

const AppointmentsContext = createContext(null);

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useLocalStorage('appointments', mockAppointments);
  const [revenueHistory, setRevenueHistory] = useLocalStorage('revenue', mockRevenueHistory);

  /** Aggiunge un nuovo appuntamento e aggiorna il ricavo del mese corrente. */
  const addAppointment = (newApp) => {
    setAppointments((prev) => [newApp, ...prev]);
    // Aggiorna il ricavo mensile se l'appuntamento è nel mese corrente
    if (newApp.date === MOCK_TODAY || newApp.date === '2026-06-06') {
      setRevenueHistory((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? { ...item, revenue: item.revenue + newApp.price, appointments: item.appointments + 1 }
            : item
        )
      );
    }
  };

  /**
   * Aggiorna solo lo status dell'appuntamento.
   * La creazione automatica del record trattamento avviene in AppLayout.
   */
  const updateAppointmentStatus = (appId, newStatus) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <AppointmentsContext.Provider
      value={{ appointments, revenueHistory, addAppointment, updateAppointmentStatus }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments deve essere usato dentro <AppointmentsProvider>');
  return ctx;
}
