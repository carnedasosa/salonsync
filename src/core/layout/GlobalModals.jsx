import React from 'react';
import { useModal } from '../context/ModalContext';
import AppointmentModal from '../../features/calendar/components/AppointmentModal';
import { NewClientModal, TreatmentRecordModal } from '../../features/crm/components/ClientModals';
import { NewServiceModal, NewProductModal } from '../../features/catalog/components/CatalogModals';
import { ConfirmActionModal, SuccessFeedbackModal } from '../../shared/ui/FeedbackModals';

export default function GlobalModals() {
  const { activeModal, modalProps } = useModal();

  return (
    <>
      {activeModal === 'NEW_APPOINTMENT' && <AppointmentModal {...modalProps} />}
      {activeModal === 'NEW_CLIENT' && <NewClientModal {...modalProps} />}
      {activeModal === 'NEW_SERVICE' && <NewServiceModal {...modalProps} />}
      {activeModal === 'NEW_PRODUCT' && <NewProductModal {...modalProps} />}
      {activeModal === 'TREATMENT_RECORD' && <TreatmentRecordModal {...modalProps} />}
      {activeModal === 'CONFIRM_ACTION' && <ConfirmActionModal {...modalProps} />}
      {activeModal === 'SUCCESS_FEEDBACK' && <SuccessFeedbackModal {...modalProps} />}
    </>
  );
}
