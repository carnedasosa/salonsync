import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useSalon } from '../../context/SalonContext';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/SalonContext', () => ({
  useSalon: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Sidebar', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useSalon.mockReturnValue({
      salon: { name: 'My Salon', isOpen: true },
    });
    useAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      profile: { full_name: 'Test User' },
      logout: mockLogout,
    });
  });

  const renderSidebar = () => {
    return render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
  };

  it('renders correctly with user data', () => {
    renderSidebar();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('My Salon')).toBeInTheDocument();
  });

  it('has an accessible logout button that calls logout()', () => {
    renderSidebar();
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();
    expect(logoutBtn).toHaveAttribute('aria-label', 'Logout');
    
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
