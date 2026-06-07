import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClientCRM from '../ClientCRM';

// Mock contexts
vi.mock('../../../core/context/ClientsContext', () => ({
  useClients: () => ({
    clients: [
      { id: '1', name: 'Mario Rossi', phone: '1234567890', allergies: 'Nessuna', treatmentHistory: [] },
      { id: '2', name: 'Luigi Verdi', phone: '0987654321', allergies: 'Nichel', treatmentHistory: [] }
    ],
    addTreatmentRecord: vi.fn(),
  }),
}));

vi.mock('../../../core/context/CatalogContext', () => ({
  useCatalog: () => ({
    services: [{ id: 's1', name: 'Taglio', price: 20 }],
  }),
}));

vi.mock('../../../core/context/ModalContext', () => ({
  useModal: () => ({
    openModal: vi.fn(),
    closeModal: vi.fn(),
  }),
}));

vi.mock('../../../core/context/SalonContext', () => ({
  useSalon: () => ({
    staff: [{ id: 'st1', name: 'Anna' }],
  }),
}));

describe('ClientCRM', () => {
  it('renders client list and filters correctly', () => {
    render(<ClientCRM />);

    // Verify both clients are rendered
    expect(screen.getAllByText('Mario Rossi')[0]).toBeTruthy();
    expect(screen.getAllByText('Luigi Verdi')[0]).toBeTruthy();

    // Type in search box (assuming the placeholder contains "Cerca")
    const searchInput = screen.getByPlaceholderText(/Cerca/i);
    fireEvent.change(searchInput, { target: { value: 'Luigi' } });

    // Verify filter works
    expect(screen.getAllByText('Luigi Verdi').length).toBeGreaterThan(0);
    // There should only be 1 "Mario Rossi" now (in the dossier header) instead of 2 (list + header)
    expect(screen.getAllByText('Mario Rossi').length).toBe(1);
  });
});
