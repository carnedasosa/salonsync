import { useState, useMemo } from 'react';
import { useClients } from '../../../core/context/ClientsContext';

export function useClientManager() {
  const { clients } = useClients();
  
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAllergiesOnly, setFilterAllergiesOnly] = useState(false);

  // Get selected client object safely
  const client = clients.find(c => c.id === selectedClientId) || clients[0];

  // Filter client list — memoised
  const filteredClients = useMemo(() => clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery);
    const matchesAllergyFilter = !filterAllergiesOnly || (c.allergies && c.allergies.toLowerCase() !== 'nessuna');
    return matchesSearch && matchesAllergyFilter;
  }), [clients, searchQuery, filterAllergiesOnly]);

  return {
    client,
    filteredClients,
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    filterAllergiesOnly,
    setFilterAllergiesOnly
  };
}
