import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CatalogProvider, useCatalog } from '../CatalogContext';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../AuthContext';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

vi.mock('../AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('CatalogContext Cache Leak & Race Condition Prevention', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <CatalogProvider>{children}</CatalogProvider>
    </QueryClientProvider>
  );

  it('includes user.id in queryKey to prevent Cache Leak', async () => {
    useAuth.mockReturnValue({ user: { id: 'user-123' } });
    
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), order: mockOrder });

    renderHook(() => useCatalog(), { wrapper });

    await waitFor(() => {
      // Check that the React Query cache key contains the user id
      const servicesCache = queryClient.getQueryCache().find({ queryKey: ['services', 'user-123'] });
      expect(servicesCache).toBeDefined();

      const productsCache = queryClient.getQueryCache().find({ queryKey: ['products', 'user-123'] });
      expect(productsCache).toBeDefined();
    });
  });

  it('uses rpc update_stock to prevent lost update race condition', async () => {
    useAuth.mockReturnValue({ user: { id: 'user-123' } });
    supabase.from.mockReturnValue({ select: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: [], error: null }) });
    supabase.rpc.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(() => useCatalog(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.updateStock('prod-1', -2);

    expect(supabase.rpc).toHaveBeenCalledWith('update_stock', {
      product_id: 'prod-1',
      amount_change: -2
    });
    
    // Ensure it's not using the client-side select + insert/update for stock
    expect(supabase.from).not.toHaveBeenCalledWith('products', expect.anything());
  });
});
