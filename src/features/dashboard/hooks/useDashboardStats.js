import { useMemo } from 'react';
import { AppointmentStatus } from '../../../core/data/constants';
import { useAppointments } from '../../../core/context/AppointmentsContext';
import { useClients } from '../../../core/context/ClientsContext';
import { useCatalog } from '../../../core/context/CatalogContext';

export function useDashboardStats(date) {
  const { appointments, revenueHistory } = useAppointments();
  const { clients } = useClients();
  const { products } = useCatalog();

  const todayAppointments = useMemo(
    () => appointments.filter(app => app.date === date),
    [appointments, date]
  );

  const completedToday = useMemo(
    () => todayAppointments.filter(app => app.status === AppointmentStatus.COMPLETED),
    [todayAppointments]
  );
  
  const todayRevenue = useMemo(
    () => todayAppointments
      .filter(app => app.status === AppointmentStatus.COMPLETED || app.status === AppointmentStatus.CONFIRMED)
      .reduce((sum, app) => sum + Number(app.price || 0), 0),
    [todayAppointments]
  );

  const lowStockProducts = useMemo(
    () => products.filter(p => p.stock <= p.minStock),
    [products]
  );

  const maxRevenue = useMemo(
    () => revenueHistory.length > 0 ? Math.max(...revenueHistory.map(r => r.revenue)) : 0,
    [revenueHistory]
  );

  const newClientsThisMonth = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    return clients.filter(c => {
      if (!c.created_at) return false;
      const clientDate = new Date(c.created_at);
      return clientDate.getMonth() === currentMonth && clientDate.getFullYear() === currentYear;
    }).length;
  }, [clients]);

  return {
    todayAppointments,
    completedToday,
    todayRevenue,
    activeClientsCount: clients.length,
    newClientsThisMonth,
    lowStockProducts,
    maxRevenue,
    revenueHistory
  };
}
