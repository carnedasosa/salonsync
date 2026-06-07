import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalendarView from '../CalendarView';
import { MOCK_TODAY } from '../../../core/data/constants';

// Mock contexts
vi.mock('../../../core/context/AppointmentsContext', () => ({
  useAppointments: () => ({
    appointments: [
      {
        id: '1',
        clientId: 'c1',
        clientName: 'Mario Rossi',
        serviceId: 's1',
        serviceName: 'Taglio',
        operatorId: 'o1',
        operatorName: 'Anna',
        date: MOCK_TODAY,
        time: '10:00',
        duration: 30,
        buffer: 10,
        price: 20,
        status: 'confirmed'
      }
    ],
    addAppointment: vi.fn(),
  }),
}));

vi.mock('../../../core/context/ClientsContext', () => ({
  useClients: () => ({
    clients: [{ id: 'c1', name: 'Mario Rossi' }],
  }),
}));

vi.mock('../../../core/context/CatalogContext', () => ({
  useCatalog: () => ({
    services: [{ id: 's1', name: 'Taglio', duration: 30, buffer: 10, price: 20 }],
  }),
}));

vi.mock('../../../core/context/SalonContext', () => ({
  useSalon: () => ({
    staff: [{ id: 'o1', name: 'Anna', role: 'Parrucchiera' }],
  }),
}));

describe('CalendarView', () => {
  // Mock window.scrollTo since JSDOM does not implement it
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  it('renders the calendar view with an appointment', () => {
    render(<CalendarView onUpdateAppointmentStatus={vi.fn()} />);
    
    expect(screen.getByText('Calendario Salone')).toBeTruthy();
    expect(screen.getByText('Anna')).toBeTruthy();
    expect(screen.getByText('Mario Rossi')).toBeTruthy();
    expect(screen.getByText('Taglio')).toBeTruthy();
  });

  it('opens the modal when clicking on Nuova Prenotazione', () => {
    render(<CalendarView onUpdateAppointmentStatus={vi.fn()} />);
    
    const addButton = screen.getByText('Nuova Prenotazione');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Nuova Prenotazione Appuntamento')).toBeTruthy();
  });
});
