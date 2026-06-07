/**
 * calendarUtils.js
 * Funzioni di utilità pura per la gestione del calendario.
 * Estraendole qui, possiamo testarle in isolamento.
 */

/**
 * Converte una stringa orario "HH:MM" in minuti dalla mezzanotte.
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Controlla se un nuovo appuntamento va in conflitto di orario
 * con gli appuntamenti esistenti per la stessa operatrice nello stesso giorno.
 * 
 * @param {Object} newApp - { date, time, duration, buffer, operatorId }
 * @param {Array} existingAppointments - Array di tutti gli appuntamenti
 * @returns {boolean} true se c'è un conflitto
 */
export function hasScheduleConflict(newApp, existingAppointments) {
  const newStartMin = timeToMinutes(newApp.time);
  const newEndMin = newStartMin + newApp.duration;
  const newEndMinWithBuffer = newEndMin + newApp.buffer;

  return existingAppointments.some((app) => {
    // Ignora appuntamenti in giorni diversi, con altre operatrici o cancellati
    if (app.date !== newApp.date || app.operatorId !== newApp.operatorId || app.status === 'cancelled') {
      return false;
    }
    
    const appStartMin = timeToMinutes(app.time);
    const appEndMin = appStartMin + app.duration;
    const appEndMinWithBuffer = appEndMin + app.buffer;

    // Logica di overlap (A inizia prima che B finisca, e A finisce dopo che B inizia)
    const overlap = (newStartMin < appEndMinWithBuffer && newEndMinWithBuffer > appStartMin);
    return overlap;
  });
}
