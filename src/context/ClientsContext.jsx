/**
 * ClientsContext.jsx
 * Gestisce l'anagrafica clienti e lo storico trattamenti.
 */
import React, { createContext, useContext } from 'react';
import { mockClients } from '../data/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

const ClientsContext = createContext(null);

export function ClientsProvider({ children }) {
  const [clients, setClients] = useLocalStorage('clients', mockClients);

  /** Aggiunge un nuovo cliente in cima alla lista. */
  const addClient = (newClient) =>
    setClients((prev) => [newClient, ...prev]);

  /**
   * Aggiunge un record allo storico trattamenti di un cliente.
   * Chiamato sia manualmente (da ClientCRM) che automaticamente
   * quando un appuntamento viene completato (da AppLayout).
   */
  const addTreatmentRecord = (clientId, record) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, treatmentHistory: [record, ...c.treatmentHistory] }
          : c
      )
    );
  };

  return (
    <ClientsContext.Provider value={{ clients, addClient, addTreatmentRecord }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error('useClients deve essere usato dentro <ClientsProvider>');
  return ctx;
}
