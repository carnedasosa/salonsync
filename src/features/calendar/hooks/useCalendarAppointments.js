import { useState, useMemo } from 'react';
import { getTodayDateString } from '../../../core/data/constants';
import { useAppointments } from '../../../core/context/AppointmentsContext';

export function useCalendarAppointments() {
  const { appointments, addAppointment } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  const dateAppointments = useMemo(
    () => appointments.filter(app => app.date === selectedDate),
    [appointments, selectedDate]
  );

  return {
    appointments,
    dateAppointments,
    addAppointment,
    selectedDate,
    setSelectedDate
  };
}
