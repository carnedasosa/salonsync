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
import { SalonProvider } from './core/context/SalonContext';
import { AppointmentsProvider } from './core/context/AppointmentsContext';
import { ClientsProvider } from './core/context/ClientsContext';
import { CatalogProvider } from './core/context/CatalogContext';
import { ModalProvider } from './core/context/ModalContext';
import AppLayout from './core/layout/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SalonProvider>
          <CatalogProvider>
            <ClientsProvider>
              <AppointmentsProvider>
                <ModalProvider>
                  <AppLayout />
                </ModalProvider>
              </AppointmentsProvider>
            </ClientsProvider>
          </CatalogProvider>
        </SalonProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
