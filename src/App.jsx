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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SalonProvider } from './core/context/SalonContext';
import { AppointmentsProvider } from './core/context/AppointmentsContext';
import { ClientsProvider } from './core/context/ClientsContext';
import { CatalogProvider } from './core/context/CatalogContext';
import { ModalProvider } from './core/context/ModalContext';
import { AuthProvider } from './core/context/AuthContext';

import AppLayout from './core/layout/AppLayout';
import ProtectedRoute from './core/layout/ProtectedRoute';
import AuthPage from './features/auth/AuthPage';
import PaywallPage from './features/auth/PaywallPage';

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
        <AuthProvider>
          <SalonProvider>
            <CatalogProvider>
              <ClientsProvider>
                <AppointmentsProvider>
                  <ModalProvider>
                    <Routes>
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/paywall" element={<PaywallPage />} />
                      <Route path="/*" element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </ModalProvider>
                </AppointmentsProvider>
              </ClientsProvider>
            </CatalogProvider>
          </SalonProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
