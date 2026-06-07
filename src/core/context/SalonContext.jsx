/**
 * SalonContext.jsx
 * Fornisce il profilo del salone e lo staff a tutta l'app.
 * Modificato per utilizzare Supabase e React Query al posto del localStorage.
 */
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { mockSalon, mockStaff } from '../data/mockSalon';

const SalonContext = createContext(null);

export function SalonProvider({ children }) {
  const queryClient = useQueryClient();

  // Fetch Salon Settings
  const { data: salon, isLoading: salonLoading, error: salonError } = useQuery({
    queryKey: ['salon'],
    queryFn: async () => {
      const { data, error } = await supabase.from('salon_settings').select('*').limit(1).maybeSingle();
      if (error) {
        console.error('Supabase error fetching salon:', error);
        throw error;
      }
      return data || null; // Ritorna null se non c'è configurazione (triggererà l'Onboarding in futuro)
    }
  });

  // Fetch Staff
  const { data: staff, isLoading: staffLoading, error: staffError } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) {
        console.error('Supabase error fetching staff:', error);
        throw error;
      }
      return data || [];
    }
  });

  const updateSalonMutation = useMutation({
    mutationFn: async (updates) => {
      if (salon?.id) {
        const { error } = await supabase.from('salon_settings').update(updates).eq('id', salon.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('salon_settings').insert([updates]);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salon'] })
  });

  const addStaffMutation = useMutation({
    mutationFn: async (member) => {
      // Normalizza i dati per il DB (rimuove proprietà fittizie se presenti)
      const { id, ...staffData } = member; 
      const { error } = await supabase.from('staff').insert([staffData]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] })
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (staffId) => {
      const { error } = await supabase.from('staff').delete().eq('id', staffId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] })
  });

  // Funzioni helper per la retrocompatibilità dell'interfaccia
  const updateSalon = (updates) => updateSalonMutation.mutateAsync(updates);
  const addStaffMember = (member) => addStaffMutation.mutateAsync(member);
  const removeStaffMember = (staffId) => deleteStaffMutation.mutateAsync(staffId);

  // Rimosso il fallback temporaneo per forzare l'uso del DB o della pagina di Onboarding
  return (
    <SalonContext.Provider value={{ 
      salon: salon || null, 
      staff: staff || [], 
      updateSalon, 
      addStaffMember,
      removeStaffMember,
      isLoading: salonLoading || staffLoading
    }}>
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
