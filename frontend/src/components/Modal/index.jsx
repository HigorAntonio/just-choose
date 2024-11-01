import React from 'react';

import Backdrop from '../Backdrop';

import { Container, ModalWrapper, ModalContent, CloseModal } from './styles';

const Modal = ({ show, setShow, children }) => {
  const handleClose = () => {
    setShow(false);
  };

  const handleKeyDown = (e) => {
    if (document.hasFocus() && e.key === 'Escape') {
      handleClose();
    }
  };

  if (!show) return null;
  return (
    <Container>
      <ModalWrapper>
        <ModalContent
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          tabIndex="-1"
        >
          {children}
          <CloseModal onClick={handleClose}>&#x2715;</CloseModal>
        </ModalContent>
        <Backdrop show={show} clicked={handleClose} />
      </ModalWrapper>
    </Container>
  );
};

export default Modal;
