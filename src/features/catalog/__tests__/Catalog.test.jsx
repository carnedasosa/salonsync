import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Catalog from '../Catalog';

// Mock context
vi.mock('../../../core/context/CatalogContext', () => ({
  useCatalog: () => ({
    services: [
      { id: '1', name: 'Taglio Donna', price: 25, category: 'Capelli' },
      { id: '2', name: 'Manicure', price: 15, category: 'Mani' }
    ],
    products: [],
    addService: vi.fn(),
  }),
}));

vi.mock('../../../core/context/ModalContext', () => ({
  useModal: () => ({
    openModal: vi.fn(),
    closeModal: vi.fn(),
  }),
}));

describe('Catalog', () => {
  it('renders the catalog services', () => {
    render(<Catalog />);
    
    // Verify services are rendered
    expect(screen.getByText('Taglio Donna')).toBeTruthy();
    expect(screen.getByText('Manicure')).toBeTruthy();
  });
});
