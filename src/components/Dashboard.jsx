import React from 'react';
import { Calendar, TrendingUp, Users, AlertCircle, PlusCircle, UserPlus, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard({ 
  clients, 
  appointments, 
  services, 
  products, 
  revenueHistory,
  setCurrentTab,
  onOpenNewBookingModal,
  onOpenNewClientModal,
  onUpdateAppointmentStatus
}) {
  // Filter today's appointments
  const todayStr = '2026-06-05'; // Static date representing "today" in mock data
  const todayAppointments = appointments.filter(app => app.date === todayStr);
  const completedToday = todayAppointments.filter(app => app.status === 'completed');
  
  // Calculate today's revenue (from completed or confirmed appts)
  const todayRevenue = todayAppointments
    .filter(app => app.status === 'completed' || app.status === 'confirmed')
    .reduce((sum, app) => sum + app.price, 0);

  // Products under min stock
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  // Monthly revenue for the chart (max value for scaling)
  const maxRevenue = Math.max(...revenueHistory.map(r => r.revenue));

  return (
    <div className="dashboard-wrapper animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1 className="gradient-text">Ciao, Aurora 👋</h1>
          <p className="subtitle">Ecco come sta andando il tuo salone oggi, Venerdì 5 Giugno 2026.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={onOpenNewBookingModal}>
            <PlusCircle size={18} />
            <span>Nuovo Appuntamento</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenNewClientModal}>
            <UserPlus size={18} />
            <span>Nuovo Cliente</span>
          </button>
        </div>
      </header>

      {/* KPI Cards grid */}
      <section className="kpi-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper purple">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-data">
            <p className="kpi-label">Incasso Odierno</p>
            <p className="kpi-value">€{todayRevenue}</p>
            <p className="kpi-change positive">Da {todayAppointments.length} appuntamenti</p>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper blue">
            <Calendar size={22} />
          </div>
          <div className="kpi-data">
            <p className="kpi-label">Stato Appuntamenti</p>
            <p className="kpi-value">{completedToday.length}/{todayAppointments.length}</p>
            <p className="kpi-change">Completati oggi</p>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper pink">
            <Users size={22} />
          </div>
          <div className="kpi-data">
            <p className="kpi-label">Clienti Attivi</p>
            <p className="kpi-value">{clients.length}</p>
            <p className="kpi-change positive">+4 questo mese</p>
          </div>
        </div>

        <div className="glass-card kpi-card warning-card">
          <div className="kpi-icon-wrapper orange">
            <AlertCircle size={22} />
          </div>
          <div className="kpi-data">
            <p className="kpi-label">Allerta Scorte</p>
            <p className="kpi-value">{lowStockProducts.length}</p>
            <p className="kpi-change negative">{lowStockProducts.length > 0 ? 'Prodotti sotto scorta' : 'Tutto in regola'}</p>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="dashboard-grid">
        {/* Left Column: Today's Schedule */}
        <section className="glass-card schedule-section">
          <div className="section-header">
            <h3>Appuntamenti di Oggi</h3>
            <span className="badge badge-info">{todayAppointments.length} totali</span>
          </div>

          <div className="appointments-timeline">
            {todayAppointments.length === 0 ? (
              <p className="empty-text">Nessun appuntamento in programma per oggi.</p>
            ) : (
              todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((app) => (
                  <div key={app.id} className={`timeline-item status-${app.status}`}>
                    <div className="app-time-col">
                      <Clock size={14} className="time-icon" />
                      <span className="app-time">{app.time}</span>
                    </div>
                    <div className="timeline-marker"></div>
                    <div className="app-details-card">
                      <div className="app-main-info">
                        <h4>{app.clientName}</h4>
                        <p className="app-service">{app.serviceName}</p>
                      </div>
                      <div className="app-meta">
                        <span className="app-operator" style={{ backgroundColor: 'rgba(236, 72, 153, 0.05)', border: `1px solid var(--accent-primary)`, color: 'var(--accent-primary)' }}>
                          {app.operatorName}
                        </span>
                        <span className="app-price">€{app.price}</span>
                      </div>
                      <div className="app-status-actions">
                        {app.status === 'confirmed' ? (
                          <button 
                            className="status-action-btn complete-btn" 
                            title="Segna come completato"
                            onClick={() => onUpdateAppointmentStatus(app.id, 'completed')}
                          >
                            <CheckCircle size={16} />
                            <span>Completa</span>
                          </button>
                        ) : (
                          <span className={`status-badge-inline ${app.status}`}>
                            {app.status === 'completed' ? 'Completato' : 'No-show'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* Right Column: Chart & Inventory Alerts */}
        <div className="right-dashboard-col">
          {/* Revenue Chart */}
          <section className="glass-card chart-section">
            <div className="section-header">
              <h3>Fatturato Mensile (SaaS Preview)</h3>
            </div>
            
            <div className="custom-chart-wrapper">
              <div className="chart-y-axis">
                <span>€{maxRevenue}</span>
                <span>€{Math.round(maxRevenue / 2)}</span>
                <span>€0</span>
              </div>
              <div className="chart-bars-container">
                {revenueHistory.map((item, index) => {
                  const percentHeight = (item.revenue / maxRevenue) * 100;
                  const isCurrentMonth = index === revenueHistory.length - 1;
                  return (
                    <div key={item.month} className="chart-bar-column">
                      <div className="chart-bar-tooltip">
                        €{item.revenue} ({item.appointments} app.)
                      </div>
                      <div className="chart-bar-track">
                        <div 
                          className={`chart-bar-fill ${isCurrentMonth ? 'current' : ''}`}
                          style={{ height: `${percentHeight}%` }}
                        >
                          <div className="bar-glow"></div>
                        </div>
                      </div>
                      <span className="chart-bar-label">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Low Stock Alerts */}
          <section className="glass-card inventory-alerts-section">
            <div className="section-header">
              <h3>Scorte sotto la soglia</h3>
            </div>
            <div className="alerts-list">
              {lowStockProducts.length === 0 ? (
                <p className="empty-text">Tutti i prodotti sono a livelli ottimali.</p>
              ) : (
                lowStockProducts.map(prod => (
                  <div key={prod.id} className="stock-alert-item">
                    <div className="stock-alert-info">
                      <p className="stock-name">{prod.name}</p>
                      <p className="stock-category">{prod.category} • Prezzo retail: €{prod.price}</p>
                    </div>
                    <div className="stock-level-badge">
                      <span className="stock-qty danger-text">{prod.stock}</span>
                      <span className="stock-min">/ min {prod.minStock}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .dashboard-wrapper {
          width: 100%;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .dashboard-header h1 {
          font-size: 2.2rem;
          margin-bottom: 0.25rem;
        }

        .dashboard-header .subtitle {
          color: var(--text-sub);
          font-size: 0.95rem;
        }

        .quick-actions {
          display: flex;
          gap: 1rem;
        }

        /* KPI Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kpi-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
        }

        .kpi-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-icon-wrapper.purple { background: rgba(236, 72, 153, 0.15); color: var(--accent-primary); }
        .kpi-icon-wrapper.blue { background: rgba(59, 130, 246, 0.15); color: var(--info); }
        .kpi-icon-wrapper.pink { background: rgba(249, 168, 212, 0.3); color: var(--accent-deep); }
        .kpi-icon-wrapper.orange { background: rgba(245, 158, 11, 0.15); color: var(--warning); }

        .warning-card {
          border-color: rgba(245, 158, 11, 0.2);
        }

        .kpi-data {
          flex: 1;
        }

        .kpi-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-sub);
          margin-bottom: 0.25rem;
        }

        .kpi-value {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.1;
          margin-bottom: 0.15rem;
        }

        .kpi-change {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .kpi-change.positive { color: var(--success); }
        .kpi-change.negative { color: var(--danger); }

        /* Dashboard Grid Layout */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 0.75rem;
        }

        .section-header h3 {
          font-size: 1.15rem;
          color: var(--text-main);
        }

        .empty-text {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-align: center;
          padding: 2rem 0;
        }

        /* Timeline Styles */
        .appointments-timeline {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 1rem;
        }

        .appointments-timeline::before {
          content: '';
          position: absolute;
          left: 65px;
          top: 15px;
          bottom: 15px;
          width: 2px;
          background: var(--border-glass);
        }

        .timeline-item {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          align-items: flex-start;
        }

        .app-time-col {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          width: 55px;
          flex-shrink: 0;
          color: var(--text-sub);
          font-size: 0.85rem;
          font-weight: 600;
          padding-top: 0.75rem;
        }

        .time-icon {
          color: var(--accent-primary);
        }

        .timeline-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--border-glass);
          border: 3px solid var(--bg-card);
          z-index: 1;
          margin-top: 0.85rem;
          flex-shrink: 0;
          transition: var(--transition);
        }

        .timeline-item.status-completed .timeline-marker {
          background: var(--success);
          box-shadow: 0 0 8px var(--success);
        }

        .timeline-item.status-confirmed .timeline-marker {
          background: var(--info);
          box-shadow: 0 0 8px var(--info);
        }

        .timeline-item.status-no-show .timeline-marker {
          background: var(--danger);
        }

        .app-details-card {
          flex: 1;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          transition: var(--transition);
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }

        .timeline-item:hover .app-details-card {
          background: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 5px 15px rgba(236, 72, 153, 0.15);
        }

        .app-main-info h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.15rem;
        }

        .app-service {
          font-size: 0.85rem;
          color: var(--text-sub);
        }

        .app-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .app-operator {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .app-price {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--text-main);
        }

        .app-status-actions {
          width: 120px;
          display: flex;
          justify-content: flex-end;
        }

        .status-action-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: var(--transition);
        }

        .complete-btn {
          background: var(--success-glow);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .complete-btn:hover {
          background: var(--success);
          color: white;
        }

        .status-badge-inline {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .status-badge-inline.completed {
          color: var(--success);
          background: var(--success-glow);
        }

        .status-badge-inline.no-show {
          color: var(--danger);
          background: var(--danger-glow);
        }

        /* Right Column layout */
        .right-dashboard-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Interactive Revenue Chart Custom */
        .custom-chart-wrapper {
          display: flex;
          height: 180px;
          padding-top: 1rem;
          gap: 1rem;
          align-items: stretch;
        }

        .chart-y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: var(--text-muted);
          font-size: 0.75rem;
          padding-bottom: 24px; /* Align with label row */
          width: 45px;
          text-align: right;
        }

        .chart-bars-container {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          position: relative;
        }

        .chart-bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
          position: relative;
        }

        .chart-bar-track {
          width: 24px;
          background: rgba(236, 72, 153, 0.05);
          border-radius: 99px;
          height: calc(100% - 24px); /* Leave room for label */
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          border: 1px solid var(--border-glass);
          transition: var(--transition);
        }

        .chart-bar-column:hover .chart-bar-track {
          border-color: var(--accent-primary);
          background: rgba(236, 72, 153, 0.1);
        }

        .chart-bar-fill {
          width: 100%;
          background: linear-gradient(180deg, var(--accent-primary) 0%, rgba(157, 78, 221, 0.3) 100%);
          border-radius: 99px;
          position: relative;
          transition: height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .chart-bar-fill.current {
          background: linear-gradient(180deg, #ff70a6 0%, rgba(255, 112, 166, 0.2) 100%);
        }

        .bar-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 10px;
          background: white;
          filter: blur(4px);
          opacity: 0.6;
          border-radius: 99px;
        }

        .chart-bar-label {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-sub);
          font-weight: 500;
        }

        .chart-bar-tooltip {
          position: absolute;
          bottom: 100%;
          background: var(--bg-modal);
          border: 1px solid var(--border-glass-hover);
          color: var(--text-main);
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transform: translateY(5px);
          transition: var(--transition);
          z-index: 5;
          box-shadow: 0 10px 25px rgba(236, 72, 153, 0.2);
        }

        .chart-bar-column:hover .chart-bar-tooltip {
          opacity: 1;
          transform: translateY(-5px);
        }

        /* Stock Alerts Widget */
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stock-alert-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.03);
          border: 1px solid rgba(239, 68, 68, 0.1);
          border-radius: var(--radius-md);
        }

        .stock-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .stock-category {
          font-size: 0.75rem;
          color: var(--text-sub);
        }

        .stock-level-badge {
          text-align: right;
          font-family: var(--font-display);
        }

        .stock-qty {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .stock-qty.danger-text {
          color: var(--danger);
        }

        .stock-min {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 0.15rem;
        }

        @media (max-width: 640px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .quick-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .btn {
            flex: 1;
            padding: 0.65rem 0.5rem;
            font-size: 0.85rem;
          }
          .appointments-timeline::before {
            left: 20px;
          }
          .app-time-col {
            width: 40px;
            font-size: 0.75rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.1rem;
          }
          .timeline-item {
            gap: 0.5rem;
          }
          .app-details-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .app-meta {
            width: 100%;
            justify-content: space-between;
          }
          .app-status-actions {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
