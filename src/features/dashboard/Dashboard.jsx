import React from 'react';
import { PlusCircle, UserPlus } from 'lucide-react';
import { getTodayDateString } from '../../core/data/constants';
import { useDashboardStats } from './hooks/useDashboardStats';
import KpiGrid from './components/KpiGrid';
import AppointmentsTimeline from './components/AppointmentsTimeline';
import RevenueChart from './components/RevenueChart';
import InventoryAlerts from './components/InventoryAlerts';
import { useModal } from '../../core/context/ModalContext';
import './Dashboard.css';

export default function Dashboard({
  onUpdateAppointmentStatus,
}) {
  const { openModal } = useModal();
  const {
    todayAppointments,
    completedToday,
    todayRevenue,
    activeClientsCount,
    newClientsThisMonth,
    lowStockProducts,
    maxRevenue,
    revenueHistory
  } = useDashboardStats(getTodayDateString());

  const formattedDate = new Intl.DateTimeFormat('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());
  const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="dashboard-wrapper animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1 className="gradient-text">Ciao, Aurora 👋</h1>
          <p className="subtitle">Ecco come sta andando il tuo salone oggi, {displayDate}.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => openModal('NEW_APPOINTMENT')}>
            <PlusCircle size={18} />
            <span>Nuovo Appuntamento</span>
          </button>
          <button className="btn btn-secondary" onClick={() => openModal('NEW_CLIENT')}>
            <UserPlus size={18} />
            <span>Nuovo Cliente</span>
          </button>
        </div>
      </header>

      {/* KPI Cards grid */}
      <KpiGrid 
        todayRevenue={todayRevenue}
        todayAppointmentsCount={todayAppointments.length}
        completedTodayCount={completedToday.length}
        activeClientsCount={activeClientsCount}
        newClientsThisMonth={newClientsThisMonth}
        lowStockProductsCount={lowStockProducts.length}
      />

      {/* Main content grid */}
      <div className="dashboard-grid">
        {/* Left Column: Today's Schedule */}
        <AppointmentsTimeline 
          appointments={todayAppointments} 
          onUpdateAppointmentStatus={onUpdateAppointmentStatus} 
        />

        {/* Right Column: Chart & Inventory Alerts */}
        <div className="right-dashboard-col">
          <RevenueChart 
            revenueHistory={revenueHistory} 
            maxRevenue={maxRevenue} 
          />
          <InventoryAlerts 
            lowStockProducts={lowStockProducts} 
          />
        </div>
      </div>
    </div>
  );
}
