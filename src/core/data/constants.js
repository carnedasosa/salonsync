// src/data/constants.js
// Centralised constants — import these instead of using raw strings or hardcoded values.

/**
 * Utility function to get the current date in YYYY-MM-DD format.
 * Replaces the old MOCK_TODAY constant.
 */
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Appointment status enum — use these constants instead of raw strings
 * to avoid silent typo bugs.
 */
export const AppointmentStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
  CANCELLED: 'cancelled',
};
