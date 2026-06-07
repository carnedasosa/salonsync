// src/data/constants.js
// Centralised constants — import these instead of using raw strings or hardcoded values.

/**
 * The mock "today" date used throughout the app in place of a real dynamic date.
 * Change this in one place to update the whole app.
 */
export const MOCK_TODAY = '2026-06-05';

/**
 * Appointment status enum — use these constants instead of raw strings
 * to avoid silent typo bugs.
 */
export const AppointmentStatus = {
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
  CANCELLED: 'cancelled',
};
