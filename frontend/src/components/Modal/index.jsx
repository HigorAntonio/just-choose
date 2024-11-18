import React, { useRef, useEffect } from 'react';

import Backdrop from '../Backdrop';

import { Container, ModalWrapper, ModalContent, CloseModal } from './styles';

const Modal = ({ show, setShow, children, autoFocusCloseButton }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (autoFocusCloseButton) {
      closeButtonRef.current?.focus();
    }
  }, [show, autoFocusCloseButton]);

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
          <CloseModal onClick={handleClose} tabIndex="0" ref={closeButtonRef}>
            &#x2715;
          </CloseModal>
          {children}
        </ModalContent>
        <Backdrop show={show} clicked={handleClose} />
      </ModalWrapper>
    </Container>
  );
};

export default Modal;
