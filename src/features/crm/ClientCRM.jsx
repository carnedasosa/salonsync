import React, { useState, useEffect } from 'react';
import { useClients } from '../../core/context/ClientsContext';
import { useCatalog } from '../../core/context/CatalogContext';
import { useSalon } from '../../core/context/SalonContext';
import ClientSidebar from './components/ClientSidebar';
import ClientDossier from './components/ClientDossier';
import { useClientManager } from './hooks/useClientManager';
import './ClientCRM.css';

export default function ClientCRM() {
  const { clients, addTreatmentRecord } = useClients();
  const { services } = useCatalog();
  const { staff } = useSalon();
  
  const {
    client,
    filteredClients,
    selectedClientId,
    setSelectedClientId,
    searchQuery,
    setSearchQuery,
    filterAllergiesOnly,
    setFilterAllergiesOnly
  } = useClientManager();

  const [showDossierMobile, setShowDossierMobile] = useState(false);



  return (
    <div className={`crm-container animate-fade-in ${showDossierMobile ? 'show-dossier' : ''}`}>
      {/* LEFT COLUMN: Client Search & Listing */}
      <ClientSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterAllergiesOnly={filterAllergiesOnly}
        setFilterAllergiesOnly={setFilterAllergiesOnly}
        filteredClients={filteredClients}
        client={client}
        setSelectedClientId={setSelectedClientId}
        setShowDossierMobile={setShowDossierMobile}
      />

      {/* RIGHT COLUMN: Client Dossier */}
      <ClientDossier 
        client={client}
        setShowDossierMobile={setShowDossierMobile}
        setSelectedClientId={setSelectedClientId}
      />
    </div>
  );
}
