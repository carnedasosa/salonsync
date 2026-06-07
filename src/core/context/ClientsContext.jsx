/**
 * ClientsContext.jsx
 * Gestisce l'anagrafica clienti e lo storico trattamenti.
 * Modificato per utilizzare Supabase e React Query.
 */
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { mockClients } from '../data/mockData';

const ClientsContext = createContext(null);

export function ClientsProvider({ children }) {
  const queryClient = useQueryClient();

  // Fetch Clients with their treatment history
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          treatmentHistory:treatments_history(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ordina i trattamenti per data decrescente localmente, o lo fa già il backend
      const formattedData = data?.map(c => ({
        ...c,
        treatmentHistory: c.treatmentHistory?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []
      })) || [];

      return formattedData;
    }
  });

  const addClientMutation = useMutation({
    mutationFn: async (newClient) => {
      // Rimuove proprietà fittizie come id generati o treatmentHistory
      const { id, treatmentHistory, ...clientData } = newClient;
      const { error } = await supabase.from('clients').insert([clientData]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] })
  });

  const addTreatmentRecordMutation = useMutation({
    mutationFn: async ({ clientId, record }) => {
      const { id, ...recordData } = record;
      const { error } = await supabase.from('treatments_history').insert([{
        ...recordData,
        clientId: clientId,
      }]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] })
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId) => {
      const { error } = await supabase.from('clients').delete().eq('id', clientId);
      if (error) throw error;
      return clientId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['clients'], (old) => {
        return old ? old.filter(c => c.id !== deletedId) : [];
      });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      // Invalidate appointments/revenue too, since cascade delete affects them
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['revenueHistory'] });
    }
  });

  const addClient = (newClient) => addClientMutation.mutateAsync(newClient);
  const addTreatmentRecord = (clientId, record) => addTreatmentRecordMutation.mutateAsync({ clientId, record });
  const deleteClient = (clientId) => deleteClientMutation.mutateAsync(clientId);

  return (
    <ClientsContext.Provider value={{ 
      clients: clients || [], 
      addClient, 
      addTreatmentRecord,
      deleteClient,
      isLoading: clientsLoading
    }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error('useClients deve essere usato dentro <ClientsProvider>');
  return ctx;
}
