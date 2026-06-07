/**
 * App.jsx
 * Punto di entrata dell'applicazione.
 * Si occupa esclusivamente di comporre i Provider nell'ordine corretto
 * e di montare AppLayout. Non contiene stato né handler.
 *
 * Ordine provider (dal più esterno al più interno):
 *   SalonProvider      — configurazione salone + staff
 *   CatalogProvider    — servizi + prodotti
 *   ClientsProvider    — clienti + trattamenti
 *   AppointmentsProvider — appuntamenti + ricavi
 *
 * AppLayout ha accesso a tutti i context tramite hook.
 */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SalonProvider } from './context/SalonContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import { ClientsProvider } from './context/ClientsContext';
import { CatalogProvider } from './context/CatalogContext';
import AppLayout from './components/AppLayout';

export default function App() {
  return (
    <BrowserRouter>
      <SalonProvider>
        <CatalogProvider>
          <ClientsProvider>
            <AppointmentsProvider>
              <AppLayout />
            </AppointmentsProvider>
          </ClientsProvider>
        </CatalogProvider>
      </SalonProvider>
    </BrowserRouter>
  );
}
