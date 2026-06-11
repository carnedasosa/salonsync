import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from '../AuthPage';
import { useAuth } from '../../../core/context/AuthContext';

// Mock useAuth
vi.mock('../../../core/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AuthPage', () => {
  const mockLogin = vi.fn();
  const mockSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
    });
  });

  const renderAuthPage = () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );
  };

  it('renders login fields by default and verifies accessibility attributes', () => {
    renderAuthPage();
    expect(screen.getByText('Bentornato! Accedi al tuo account.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    
    // Test a11y roles on tabs
    const loginTab = screen.getByRole('tab', { name: 'Accedi' });
    const signupTab = screen.getByRole('tab', { name: 'Registrati' });
    expect(loginTab).toHaveAttribute('aria-selected', 'true');
    expect(signupTab).toHaveAttribute('aria-selected', 'false');
  });

  it('clears form fields when switching tabs', () => {
    renderAuthPage();
    
    // Fill login email
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
    
    // Switch to signup
    const signupTab = screen.getByRole('tab', { name: 'Registrati' });
    fireEvent.click(signupTab);
    
    // Check if wiped out
    expect(emailInput.value).toBe('');
    expect(screen.getByLabelText('Nome Completo').value).toBe('');
  });

  it('shows local validation error when passwords do not match', async () => {
    renderAuthPage();
    
    // Switch to signup
    const signupTab = screen.getByRole('tab', { name: 'Registrati' });
    fireEvent.click(signupTab);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Nome Completo'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Conferma Password'), { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Crea Account' }));
    
    expect(await screen.findByText('Le password non corrispondono.')).toBeInTheDocument();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('calls signup with email, password, and name on successful validation', async () => {
    renderAuthPage();
    
    const signupTab = screen.getByRole('tab', { name: 'Registrati' });
    fireEvent.click(signupTab);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Nome Completo'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Conferma Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Crea Account' }));
    
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    });
  });
});
