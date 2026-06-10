import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, ShoppingBag, Sparkles, Settings, LogOut } from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

// Defined at module scope — avoids recreation on every render
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'crm', label: 'Schede Clienti', icon: Users },
  { id: 'catalog', label: 'Listino & Scorte', icon: ShoppingBag },
  { id: 'settings', label: 'Impostazioni', icon: Settings },
];

export default function Sidebar() {
  const { salon } = useSalon();
  const { user, profile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const displayName = profile?.full_name || user?.email || 'Utente';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Sparkles className="brand-icon" aria-hidden="true" />
        </div>
        <span className="brand-name">salonSync</span>
      </div>

      <div className="salon-status-card">
        <div className="status-dot" style={{ backgroundColor: 'var(--success)' }}></div>
        <div className="status-info">
          <p className="salon-title">{salon ? salon.name : 'Caricamento...'}</p>
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
                  <IconComponent className="nav-icon" size={20} aria-hidden="true" />
                  <span className="nav-label">{item.label}</span>
                  {isActive && <div className="nav-active-indicator" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-profile">
        <div className="profile-info">
          <div className="profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="profile-name">{displayName}</span>
        </div>
        <button 
          type="button" 
          className="logout-button" 
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="sidebar-footer">
        <p className="footer-version">salonSync v1.0.0</p>
        <p className="footer-copyright">© 2026 Student Project</p>
      </div>
    </aside>
  );
}

