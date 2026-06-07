import React, { useState, useEffect } from 'react';
import { useClients } from '../../core/context/ClientsContext';
import { useCatalog } from '../../core/context/CatalogContext';
import { useSalon } from '../../core/context/SalonContext';
import ClientSidebar from './components/ClientSidebar';
import ClientDossier from './components/ClientDossier';
import { TreatmentRecordModal } from './components/ClientModals';
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

  // Client Details Modals & Forms State
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

  // New Treatment Record Form State
  const [treatServiceId, setTreatServiceId] = useState('');
  const [treatOperatorId, setTreatOperatorId] = useState(staff[0]?.id || '');
  const [treatNotes, setTreatNotes] = useState('');
  const [treatPrice, setTreatPrice] = useState('');

  // (Filtered clients and selected client are now managed by useClientManager hook)

  // Handle logging new treatment record
  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!treatServiceId || !treatOperatorId || !treatNotes) return;

    const selectedService = services.find(s => s.id === treatServiceId);
    const selectedOperator = staff.find(st => st.id === treatOperatorId);

    if (!selectedService || !selectedOperator) return;
    
    const newRecord = {
      id: `th_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      serviceName: selectedService.name,
      operatorName: selectedOperator.name,
      notes: treatNotes,
      price: Number(treatPrice) || selectedService.price,
      beforePhoto: '',
      afterPhoto: ''
    };

    addTreatmentRecord(client.id, newRecord);
    setIsTreatmentModalOpen(false);

    // Reset fields
    setTreatServiceId('');
    setTreatOperatorId(staff[0]?.id || '');
    setTreatNotes('');
    setTreatPrice('');
  };

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
        setIsTreatmentModalOpen={setIsTreatmentModalOpen}
      />

      {/* MODAL 2: Add Treatment Record */}
      <TreatmentRecordModal 
        isTreatmentModalOpen={isTreatmentModalOpen}
        setIsTreatmentModalOpen={setIsTreatmentModalOpen}
        client={client}
        handleAddRecord={handleAddRecord}
        services={services}
        staff={staff}
        treatServiceId={treatServiceId}
        setTreatServiceId={setTreatServiceId}
        treatOperatorId={treatOperatorId}
        setTreatOperatorId={setTreatOperatorId}
        treatPrice={treatPrice}
        setTreatPrice={setTreatPrice}
        treatNotes={treatNotes}
        setTreatNotes={setTreatNotes}
      />
    </div>
  );
}
