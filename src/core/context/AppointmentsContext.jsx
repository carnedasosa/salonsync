/**
 * AppointmentsContext.jsx
 * Gestisce lo stato degli appuntamenti.
 * Modificato per utilizzare Supabase e React Query.
 */
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

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

  // Fetch Revenue History da View SQL Supabase
  const { data: rawRevenueHistory, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenueHistory'],
    queryFn: async () => {
      const { data, error } = await supabase.from('monthly_revenue').select('*');
      if (error) throw error;
      
      return data.map(item => {
        const d = new Date(item.month_key + '-01');
        const monthName = new Intl.DateTimeFormat('it-IT', { month: 'short' }).format(d);
        // Formatta in Gen, Feb, Mar ecc.
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        
        return {
          month: capitalizedMonth,
          revenue: Number(item.revenue),
          appointments: Number(item.appointments)
        };
      });
    }
  });

  const revenueHistory = rawRevenueHistory || [];

  const addAppointmentMutation = useMutation({
    mutationFn: async (newApp) => {
      // Rimuove l'id generato localmente
      const { id, ...appData } = newApp; 
      
      const { data, error } = await supabase.from('appointments').insert([appData]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (insertedApp) => {
      queryClient.setQueryData(['appointments'], (old) => {
        return old ? [insertedApp, ...old] : [insertedApp];
      });
      queryClient.invalidateQueries({ queryKey: ['revenueHistory'] });
    }
  });

  const updateAppointmentStatusMutation = useMutation({
    mutationFn: async ({ appId, newStatus }) => {
      const { data, error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', appId).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (updatedApp) => {
      queryClient.setQueryData(['appointments'], (old) => {
        return old ? old.map(app => app.id === updatedApp.id ? updatedApp : app) : [];
      });
      queryClient.invalidateQueries({ queryKey: ['revenueHistory'] });
    }
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
