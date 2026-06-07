import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, ShoppingBag, Sparkles } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

// Defined at module scope — avoids recreation on every render
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'crm', label: 'Schede Clienti', icon: Users },
  { id: 'catalog', label: 'Listino & Scorte', icon: ShoppingBag },
];

export default function Sidebar() {
  const { salon } = useSalon();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Sparkles className="brand-icon" />
        </div>
        <span className="brand-name">salonSync</span>
      </div>

      <div className="salon-status-card">
        <div className="status-dot" style={{ backgroundColor: salon.isOpen ? 'var(--success)' : 'var(--danger)' }}></div>
        <div className="status-info">
          <p className="salon-title">{salon.name}</p>
          <p className="salon-subtitle">{salon.isOpen ? 'Salone Aperto' : 'Salone Chiuso'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <IconComponent className="nav-icon" size={20} />
                  <span className="nav-label">{item.label}</span>
                  {isActive && <div className="nav-active-indicator" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="footer-version">salonSync v1.0.0</p>
        <p className="footer-copyright">© 2026 Student Project</p>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          background: rgba(255, 255, 255, 0.85); /* Light glass sidebar */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid var(--border-glass);
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-left: 0.5rem;
        }

        .brand-icon-wrapper {
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
        }

        .brand-icon {
          color: #ffffff;
          animation: float 3s ease-in-out infinite;
        }

        .brand-name {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, var(--accent-cta) 0%, var(--accent-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .salon-status-card {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--success);
          box-shadow: 0 0 8px var(--success);
          animation: pulse 2s infinite;
        }

        .salon-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .salon-subtitle {
          font-size: 0.75rem;
          color: var(--text-sub);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-sub);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.95rem;
          text-align: left;
          position: relative;
          transition: var(--transition);
        }

        .nav-item:hover {
          color: var(--accent-deep);
          background: rgba(236, 72, 153, 0.05);
        }

        .nav-item.active {
          color: var(--accent-primary);
          background: rgba(236, 72, 153, 0.08);
          font-weight: 600;
        }

        .nav-icon {
          transition: var(--transition);
        }

        .nav-item.active .nav-icon {
          color: var(--accent-primary);
        }

        .nav-active-indicator {
          position: absolute;
          right: 0;
          top: 25%;
          bottom: 25%;
          width: 3px;
          background-color: var(--accent-primary);
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
        }

        .sidebar-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-glass);
          padding-top: 1rem;
          font-size: 0.7rem;
          color: var(--text-muted);
          text-align: center;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        @media (max-width: 1024px) {
          .sidebar {
            width: 80px;
            padding: 2rem 0.5rem;
            align-items: center;
          }
          .brand-name, .salon-status-card, .nav-label, .sidebar-footer, .nav-active-indicator {
            display: none;
          }
          .sidebar-brand {
            margin-bottom: 2.5rem;
            justify-content: center;
            padding-left: 0;
          }
          .nav-item {
            justify-content: center;
            padding: 1rem;
          }
        }

        @media (max-width: 640px) {
          .sidebar {
            width: 100%;
            height: 60px;
            flex-direction: row;
            position: fixed;
            bottom: auto;
            top: 0;
            padding: 0.5rem 1rem;
            justify-content: space-between;
            align-items: center;
            border-right: none;
            border-bottom: 1px solid var(--border-glass);
          }
          .sidebar-brand {
            margin-bottom: 0;
          }
          .brand-name {
            display: block;
          }
          .sidebar-nav {
            flex-direction: row;
            gap: 0.25rem;
            flex: 0;
          }
          .nav-item {
            padding: 0.5rem;
          }
          .nav-label {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
