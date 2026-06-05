import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ClientCRM from './components/ClientCRM';
import Catalog from './components/Catalog';

import {
  mockClients,
  mockServices,
  mockStaff,
  mockProducts,
  mockAppointments,
  mockRevenueHistory
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Reset scroll position of main content when tab changes
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [currentTab]);
  
  // Application Central States
  const [clients, setClients] = useState(mockClients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [services, setServices] = useState(mockServices);
  const [products, setProducts] = useState(mockProducts);
  const [revenueHistory, setRevenueHistory] = useState(mockRevenueHistory);
  const [staff] = useState(mockStaff);

  // Cross-Tab Modal triggers
  const [forceOpenCalendarModal, setForceOpenCalendarModal] = useState(false);
  const [forceOpenClientModal, setForceOpenClientModal] = useState(false);

  // Handlers for App state updates

  // Add a new booking
  const handleAddAppointment = (newApp) => {
    setAppointments(prev => [newApp, ...prev]);
    
    // Simulate updating monthly revenue history for June (month index 5 in mockRevenueHistory)
    if (newApp.date === '2026-06-05' || newApp.date === '2026-06-06') {
      setRevenueHistory(prev => prev.map((item, index) => {
        if (index === prev.length - 1) { // Current month (Giu)
          return {
            ...item,
            revenue: item.revenue + newApp.price,
            appointments: item.appointments + 1
          };
        }
        return item;
      }));
    }
  };

  // Update appointment status and automatically create a CRM treatment history record
  const handleUpdateAppointmentStatus = (appId, newStatus) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === appId) {
        const updatedApp = { ...app, status: newStatus };
        
        // If status becomes completed, create a record in Client CRM history automatically
        if (newStatus === 'completed') {
          setClients(cPrev => cPrev.map(client => {
            if (client.id === app.clientId) {
              const alreadyHasRecord = client.treatmentHistory.some(rec => rec.id === `th_auto_${appId}`);
              if (!alreadyHasRecord) {
                const newRecord = {
                  id: `th_auto_${appId}`,
                  date: app.date,
                  serviceName: app.serviceName,
                  operatorName: app.operatorName,
                  price: app.price,
                  notes: `Trattamento completato. Scrivi qui la formula tecnica o altre note relative al trattamento.`,
                  beforePhoto: '',
                  afterPhoto: ''
                };
                return {
                  ...client,
                  treatmentHistory: [newRecord, ...client.treatmentHistory]
                };
              }
            }
            return client;
          }));
        }
        
        return updatedApp;
      }
      return app;
    }));
  };

  // Add a new client
  const handleAddClient = (newClient) => {
    setClients(prev => [newClient, ...prev]);
  };

  // Add manual treatment record to a client card
  const handleAddTreatmentRecord = (clientId, newRecord) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          treatmentHistory: [newRecord, ...c.treatmentHistory]
        };
      }
      return c;
    }));
  };

  // Add new service
  const handleAddService = (newService) => {
    setServices(prev => [...prev, newService]);
  };

  // Add new product
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  };

  // Adjust stock level (sales / restocking)
  const handleUpdateStock = (prodId, amount) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const newStock = Math.max(0, p.stock + amount);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  // Helpers to trigger modal openings from Dashboard
  const triggerNewBooking = () => {
    setCurrentTab('calendar');
    setForceOpenCalendarModal(true);
  };

  const triggerNewClient = () => {
    setCurrentTab('crm');
    setForceOpenClientModal(true);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Panel Viewport */}
      <main className="main-content">
        {currentTab === 'dashboard' && (
          <Dashboard
            clients={clients}
            appointments={appointments}
            services={services}
            products={products}
            revenueHistory={revenueHistory}
            setCurrentTab={setCurrentTab}
            onOpenNewBookingModal={triggerNewBooking}
            onOpenNewClientModal={triggerNewClient}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            appointments={appointments}
            clients={clients}
            services={services}
            staff={staff}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            forceOpenModal={forceOpenCalendarModal}
            onResetForceOpen={() => setForceOpenCalendarModal(false)}
          />
        )}

        {currentTab === 'crm' && (
          <ClientCRM
            clients={clients}
            services={services}
            staff={staff}
            onAddClient={handleAddClient}
            onAddTreatmentRecord={handleAddTreatmentRecord}
            forceOpenClientModal={forceOpenClientModal}
            onResetForceOpenClient={() => setForceOpenClientModal(false)}
          />
        )}

        {currentTab === 'catalog' && (
          <Catalog
            services={services}
            products={products}
            onAddService={handleAddService}
            onAddProduct={handleAddProduct}
            onUpdateStock={handleUpdateStock}
          />
        )}
      </main>
    </div>
  );
}
