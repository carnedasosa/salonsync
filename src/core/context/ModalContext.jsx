import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // 'NEW_APPOINTMENT', 'NEW_CLIENT', null
  const [modalProps, setModalProps] = useState({});

  const openModal = (modalName, props = {}) => {
    setActiveModal(modalName);
    setModalProps(props);
  };
  
  const closeModal = () => {
    setActiveModal(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ activeModal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
