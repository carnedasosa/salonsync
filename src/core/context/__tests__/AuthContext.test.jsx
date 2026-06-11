import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('AuthContext', () => {
  let queryClient;
  let authStateChangeCallback;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
    
    // Default mocks
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null
    });
    
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: '123', full_name: 'Test User' },
      error: null
    });
    
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: mockEq,
      single: mockSingle,
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  it('provides user and profile on successful init', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual({ id: '123' });
    expect(result.current.profile).toEqual({ id: '123', full_name: 'Test User' });
  });

  it('clears query cache on SIGNED_OUT event to prevent cache leak', async () => {
    vi.spyOn(queryClient, 'clear');
    vi.spyOn(queryClient, 'cancelQueries');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate SIGNED_OUT event
    await act(async () => {
      await authStateChangeCallback('SIGNED_OUT', null);
    });

    expect(queryClient.cancelQueries).toHaveBeenCalled();
    expect(queryClient.clear).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it('clears query cache on logout error to force local logout', async () => {
    vi.spyOn(queryClient, 'clear');
    vi.spyOn(queryClient, 'cancelQueries');
    
    supabase.auth.signOut.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    try {
      await act(async () => {
        await result.current.logout();
      });
    } catch (e) {
      expect(e.message).toBe('Network error');
    }

    expect(queryClient.cancelQueries).toHaveBeenCalled();
    expect(queryClient.clear).toHaveBeenCalled();
  });

  it('calls supabase.auth.signInWithPassword on login', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: '1' } }, error: null });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let data;
    await act(async () => {
      data = await result.current.login('test@test.com', 'password');
    });
    
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
    expect(data).toEqual({ user: { id: '1' } });
  });

  it('calls supabase.auth.signUp with fullName in options on signup', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user: { id: '1' } }, error: null });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let data;
    await act(async () => {
      data = await result.current.signup('test@test.com', 'password', 'Test User');
    });
    
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
      options: { data: { full_name: 'Test User' } }
    });
    expect(data).toEqual({ user: { id: '1' } });
  });
});
