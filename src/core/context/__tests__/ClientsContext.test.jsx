import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientsProvider, useClients } from '../ClientsContext';
import { supabase } from '../../supabaseClient';

// Mock Supabase client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('ClientsContext', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <ClientsProvider>{children}</ClientsProvider>
    </QueryClientProvider>
  );

  it('fetches clients from supabase and formats them', async () => {
    // Mock the supabase chain
    const mockData = [
      { id: '1', name: 'Mario', treatmentHistory: [] }
    ];
    
    const mockSelect = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
    
    supabase.from.mockReturnValue({
      select: mockSelect,
      order: mockOrder,
    });

    const { result } = renderHook(() => useClients(), { wrapper });

    // Initially loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clients).toHaveLength(1);
    expect(result.current.clients[0].name).toBe('Mario');
    expect(supabase.from).toHaveBeenCalledWith('clients');
    expect(mockSelect).toHaveBeenCalled();
    expect(mockOrder).toHaveBeenCalled();
  });
});
