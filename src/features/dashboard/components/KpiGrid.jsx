import React from 'react';
import { Calendar, TrendingUp, Users, AlertCircle } from 'lucide-react';

export default function KpiGrid({ todayRevenue, todayAppointmentsCount, completedTodayCount, activeClientsCount, newClientsThisMonth, lowStockProductsCount }) {
  return (
    <section className="kpi-grid">
      <div className="glass-card kpi-card">
        <div className="kpi-icon-wrapper purple">
          <TrendingUp size={22} />
        </div>
        <div className="kpi-data">
          <p className="kpi-label">Incasso Odierno</p>
          <p className="kpi-value">€{todayRevenue}</p>
          <p className="kpi-change positive">Da {todayAppointmentsCount} appuntamenti</p>
        </div>
      </div>

      <div className="glass-card kpi-card">
        <div className="kpi-icon-wrapper blue">
          <Calendar size={22} />
        </div>
        <div className="kpi-data">
          <p className="kpi-label">Stato Appuntamenti</p>
          <p className="kpi-value">{completedTodayCount}/{todayAppointmentsCount}</p>
          <p className="kpi-change">Completati oggi</p>
        </div>
      </div>

      <div className="glass-card kpi-card">
        <div className="kpi-icon-wrapper pink">
          <Users size={22} />
        </div>
        <div className="kpi-data">
          <p className="kpi-label">Clienti Attivi</p>
          <p className="kpi-value">{activeClientsCount}</p>
          <p className={`kpi-change ${newClientsThisMonth > 0 ? 'positive' : ''}`}>
            {newClientsThisMonth > 0 ? `+${newClientsThisMonth} questo mese` : '0 questo mese'}
          </p>
        </div>
      </div>

      <div className={`glass-card kpi-card ${lowStockProductsCount > 0 ? 'warning-card' : ''}`}>
        <div className="kpi-icon-wrapper orange">
          <AlertCircle size={22} />
        </div>
        <div className="kpi-data">
          <p className="kpi-label">Allerta Scorte</p>
          <p className="kpi-value">{lowStockProductsCount}</p>
          <p className={`kpi-change ${lowStockProductsCount > 0 ? 'negative' : ''}`}>
            {lowStockProductsCount > 0 ? 'Prodotti sotto scorta' : 'Tutto in regola'}
          </p>
        </div>
      </div>
    </section>
  );
}
