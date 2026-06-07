import { describe, it, expect } from 'vitest';
import { timeToMinutes, hasScheduleConflict } from './calendarUtils';

describe('calendarUtils', () => {
  describe('timeToMinutes', () => {
    it('dovrebbe convertire correttamente "HH:MM" in minuti', () => {
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('01:30')).toBe(90);
      expect(timeToMinutes('10:15')).toBe(615);
      expect(timeToMinutes('23:59')).toBe(1439);
    });

    it('dovrebbe gestire input vuoti', () => {
      expect(timeToMinutes('')).toBe(0);
      expect(timeToMinutes(null)).toBe(0);
    });
  });

  describe('hasScheduleConflict', () => {
    const existingAppointments = [
      { id: 'a1', date: '2026-06-05', time: '09:00', duration: 60, buffer: 15, operatorId: 'st1', status: 'confirmed' }, // 09:00 - 10:15
      { id: 'a2', date: '2026-06-05', time: '11:00', duration: 30, buffer: 10, operatorId: 'st1', status: 'confirmed' }, // 11:00 - 11:40
      { id: 'a3', date: '2026-06-06', time: '09:00', duration: 60, buffer: 15, operatorId: 'st1', status: 'confirmed' }, // Altro giorno
      { id: 'a4', date: '2026-06-05', time: '14:00', duration: 60, buffer: 15, operatorId: 'st2', status: 'confirmed' }, // Altra operatrice
      { id: 'a5', date: '2026-06-05', time: '15:00', duration: 60, buffer: 15, operatorId: 'st1', status: 'cancelled' }, // Cancellato
    ];

    it('non dovrebbe trovare conflitti se non ci sono sovrapposizioni', () => {
      const newApp = { date: '2026-06-05', time: '10:15', duration: 30, buffer: 15, operatorId: 'st1' };
      expect(hasScheduleConflict(newApp, existingAppointments)).toBe(false);
    });

    it('dovrebbe trovare conflitti se c\'è sovrapposizione parziale (inizio)', () => {
      const newApp = { date: '2026-06-05', time: '08:30', duration: 45, buffer: 0, operatorId: 'st1' }; // 08:30 - 09:15, accavalla con a1
      expect(hasScheduleConflict(newApp, existingAppointments)).toBe(true);
    });

    it('dovrebbe trovare conflitti se c\'è sovrapposizione parziale (fine)', () => {
      const newApp = { date: '2026-06-05', time: '09:45', duration: 45, buffer: 0, operatorId: 'st1' }; // 09:45 - 10:30, accavalla con a1
      expect(hasScheduleConflict(newApp, existingAppointments)).toBe(true);
    });

    it('dovrebbe trovare conflitti se un appuntamento è contenuto in un altro', () => {
      const newApp = { date: '2026-06-05', time: '09:15', duration: 15, buffer: 0, operatorId: 'st1' };
      expect(hasScheduleConflict(newApp, existingAppointments)).toBe(true);
    });

    it('non dovrebbe trovare conflitti per giorni diversi', () => {
      const newApp = { date: '2026-06-06', time: '11:00', duration: 30, buffer: 10, operatorId: 'st1' }; // Accavalla a2 se fosse stesso giorno
      expect(hasScheduleConflict(newApp, existingAppointments)).toBe(false);
    });

    it('non dovrebbe trovare conflitti per operatrici diverse', () => {
      const newApp = { date: '2026-06-05', time: '09:00', duration: 60, buffer: 15, operatorId: 'st2' };
      expect(hasScheduleConflict(newApp, existingAppointments)).toBe(false);
    });

    it('non dovrebbe considerare gli appuntamenti cancellati', () => {
      const newApp = { date: '2026-06-05', time: '15:00', duration: 60, buffer: 15, operatorId: 'st1' };
      expect(hasScheduleConflict(newApp, existingAppointments)).toBe(false);
    });
  });
});
