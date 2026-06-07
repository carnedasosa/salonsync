/**
 * SalonContext.jsx
 * Fornisce il profilo del salone e lo staff a tutta l'app.
 * È l'equivalente di "chi ha fatto login" — in futuro, qui
 * si farebbe la chiamata API per caricare il profilo autenticato.
 */
import React, { createContext, useContext } from 'react';
import { mockSalon, mockStaff } from '../data/mockSalon';
import useLocalStorage from '../hooks/useLocalStorage';

const SalonContext = createContext(null);

export function SalonProvider({ children }) {
  const [salon, setSalon] = useLocalStorage('salon', mockSalon);
  const [staff, setStaff] = useLocalStorage('staff', mockStaff);

  /** Aggiorna campi del profilo salone (es. nome, orari). */
  const updateSalon = (updates) =>
    setSalon((prev) => ({ ...prev, ...updates }));

  /** Aggiunge un'operatrice allo staff. */
  const addStaffMember = (member) =>
    setStaff((prev) => [...prev, member]);

  return (
    <SalonContext.Provider value={{ salon, staff, updateSalon, addStaffMember }}>
      {children}
    </SalonContext.Provider>
  );
}

/**
 * Hook per accedere al context del salone.
 * Lancia un errore chiaro se usato fuori dal Provider.
 */
export function useSalon() {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error('useSalon deve essere usato dentro <SalonProvider>');
  return ctx;
}
