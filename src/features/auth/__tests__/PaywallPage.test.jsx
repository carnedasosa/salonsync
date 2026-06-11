import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import PaywallPage from '../PaywallPage';
import { useAuth } from '../../../core/context/AuthContext';

vi.mock('../../../core/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PaywallPage Memory Leaks & Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('sets up and clears intervals and timeouts when success=true is passed', () => {
    const mockRefreshProfile = vi.fn();
    useAuth.mockReturnValue({
      session: { access_token: '123' },
      profile: { status: 'pending' },
      refreshProfile: mockRefreshProfile,
      logout: vi.fn()
    });

    const { unmount } = render(
      <MemoryRouter initialEntries={['/paywall?success=true']}>
        <PaywallPage />
      </MemoryRouter>
    );

    // Initial state: verifying is true
    expect(screen.getByText('Verifica pagamento...')).toBeInTheDocument();

    // Fast-forward 2 seconds to trigger interval
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockRefreshProfile).toHaveBeenCalledTimes(1);

    // Fast-forward another 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockRefreshProfile).toHaveBeenCalledTimes(2);

    // Unmount before timeout reaches
    unmount();

    // Fast-forward past timeout to ensure it doesn't run and interval is cleared
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // It should not have been called again after unmount
    expect(mockRefreshProfile).toHaveBeenCalledTimes(2);
  });

  it('stops verifying after 15 seconds', () => {
    const mockRefreshProfile = vi.fn();
    useAuth.mockReturnValue({
      session: { access_token: '123' },
      profile: { status: 'pending' },
      refreshProfile: mockRefreshProfile,
      logout: vi.fn()
    });

    render(
      <MemoryRouter initialEntries={['/paywall?success=true']}>
        <PaywallPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Verifica pagamento...')).toBeInTheDocument();

    // Fast-forward 15 seconds
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Timeout should have fired and cleared interval, setting verifying to false
    expect(screen.getByText('Account in attesa di approvazione')).toBeInTheDocument();
  });
});
