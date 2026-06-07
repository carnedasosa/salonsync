import React from 'react';
import { useModal } from '../context/ModalContext';
import AppointmentModal from '../../features/calendar/components/AppointmentModal';
import { NewClientModal } from '../../features/crm/components/ClientModals';

export default function GlobalModals() {
  const { activeModal, modalProps } = useModal();

  return (
    <>
      {activeModal === 'NEW_APPOINTMENT' && <AppointmentModal {...modalProps} />}
      {activeModal === 'NEW_CLIENT' && <NewClientModal {...modalProps} />}
    </>
  );
}
