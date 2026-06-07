/**
 * AppointmentsContext.jsx
 * Gestisce lo stato degli appuntamenti.
 * Modificato per utilizzare Supabase e React Query.
 */
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { mockAppointments, mockRevenueHistory } from '../data/mockData';

const AppointmentsContext = createContext(null);

export function AppointmentsProvider({ children }) {
  const queryClient = useQueryClient();

  // Fetch Appointments
  const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('appointments').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Per il momento manteniamo la history dei ricavi mockata, 
  // in futuro verrà calcolata con una View SQL su Supabase
  const revenueHistory = mockRevenueHistory;

  const addAppointmentMutation = useMutation({
    mutationFn: async (newApp) => {
      // Rimuove l'id generato localmente
      const { id, price, ...appData } = newApp; 
      
      const { error } = await supabase.from('appointments').insert([appData]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const updateAppointmentStatusMutation = useMutation({
    mutationFn: async ({ appId, newStatus }) => {
      const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', appId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const addAppointment = (newApp) => addAppointmentMutation.mutateAsync(newApp);
  const updateAppointmentStatus = (appId, newStatus) => updateAppointmentStatusMutation.mutateAsync({ appId, newStatus });

  return (
    <AppointmentsContext.Provider
      value={{ 
        appointments: appointments || [], 
        revenueHistory, 
        addAppointment, 
        updateAppointmentStatus,
        isLoading: appointmentsLoading
      }}
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
