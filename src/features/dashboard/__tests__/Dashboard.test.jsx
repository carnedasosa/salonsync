import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import { useAuth } from '../../../core/context/AuthContext';
import { useModal } from '../../../core/context/ModalContext';
import { useDashboardStats } from '../hooks/useDashboardStats';

vi.mock('../../../core/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../core/context/ModalContext', () => ({
  useModal: vi.fn(),
}));

vi.mock('../hooks/useDashboardStats', () => ({
  useDashboardStats: vi.fn(),
}));

// Mock the child components that might be complex to render independently
vi.mock('../components/KpiGrid', () => ({
  default: () => <div data-testid="kpi-grid">KpiGrid</div>
}));
vi.mock('../components/AppointmentsTimeline', () => ({
  default: () => <div data-testid="appointments-timeline">AppointmentsTimeline</div>
}));
vi.mock('../components/RevenueChart', () => ({
  default: () => <div data-testid="revenue-chart">RevenueChart</div>
}));
vi.mock('../components/InventoryAlerts', () => ({
  default: () => <div data-testid="inventory-alerts">InventoryAlerts</div>
}));

describe('Dashboard', () => {
  const mockOpenModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useAuth.mockReturnValue({
      profile: { full_name: 'Test User' },
      user: null
    });
    
    useModal.mockReturnValue({
      openModal: mockOpenModal
    });

    useDashboardStats.mockReturnValue({
      todayAppointments: [],
      completedToday: [],
      todayRevenue: 0,
      activeClientsCount: 0,
      newClientsThisMonth: 0,
      lowStockProducts: [],
      maxRevenue: 0,
      revenueHistory: []
    });
  });

  it('renders correctly with mocked data', () => {
    render(<Dashboard onUpdateAppointmentStatus={vi.fn()} />);
    
    // Check if header is rendered with user's name
    expect(screen.getByText(/Ciao, Test User 👋/i)).toBeInTheDocument();
    
    // Check if action buttons exist
    expect(screen.getByRole('button', { name: /Nuovo Appuntamento/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nuovo Cliente/i })).toBeInTheDocument();
    
    // Check if mocked child components are rendered
    expect(screen.getByTestId('kpi-grid')).toBeInTheDocument();
    expect(screen.getByTestId('appointments-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
    expect(screen.getByTestId('inventory-alerts')).toBeInTheDocument();
  });

  it('opens new appointment modal on click', () => {
    render(<Dashboard onUpdateAppointmentStatus={vi.fn()} />);
    
    const newAppointmentBtn = screen.getByRole('button', { name: /Nuovo Appuntamento/i });
    fireEvent.click(newAppointmentBtn);
    
    expect(mockOpenModal).toHaveBeenCalledWith('NEW_APPOINTMENT');
  });

  it('opens new client modal on click', () => {
    render(<Dashboard onUpdateAppointmentStatus={vi.fn()} />);
    
    const newClientBtn = screen.getByRole('button', { name: /Nuovo Cliente/i });
    fireEvent.click(newClientBtn);
    
    expect(mockOpenModal).toHaveBeenCalledWith('NEW_CLIENT');
  });
});
