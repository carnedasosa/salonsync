import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppointmentsProvider, useAppointments } from '../AppointmentsContext';
import { cleanup } from '@testing-library/react';

// Mock component to consume the context
function TestComponent() {
  const { appointments, addAppointment, updateAppointmentStatus } = useAppointments();

  return (
    <div>
      <div data-testid="count">{appointments.length}</div>
      <button 
        data-testid="add-btn" 
        onClick={() => addAppointment({ id: '1', title: 'Test App', date: '2026-06-06', status: 'In attesa' })}
      >
        Add
      </button>
      <button 
        data-testid="update-btn" 
        onClick={() => updateAppointmentStatus('1', 'Completato')}
      >
        Update Status
      </button>
      <ul>
        {appointments.map(app => (
          <li key={app.id} data-testid={`app-${app.id}`}>{app.status}</li>
        ))}
      </ul>
    </div>
  );
}

describe('AppointmentsContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should initialize with mock data', () => {
    render(
      <AppointmentsProvider>
        <TestComponent />
      </AppointmentsProvider>
    );
    // the mock data has 6 items initially
    expect(screen.getByTestId('count').textContent).toBe('6');
  });

  it('should add a new appointment', () => {
    render(
      <AppointmentsProvider>
        <TestComponent />
      </AppointmentsProvider>
    );

    act(() => {
      screen.getByTestId('add-btn').click();
    });

    expect(screen.getByTestId('count').textContent).toBe('7');
    expect(screen.getByTestId('app-1').textContent).toBe('In attesa');
  });

  it('should update appointment status', () => {
    render(
      <AppointmentsProvider>
        <TestComponent />
      </AppointmentsProvider>
    );

    act(() => {
      screen.getByTestId('add-btn').click();
    });

    act(() => {
      screen.getByTestId('update-btn').click();
    });

    expect(screen.getByTestId('app-1').textContent).toBe('Completato');
  });
});
