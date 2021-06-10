import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  z-index: 1000;
`;

export const ModalWrapper = styled.div`
  /* width: min(420px, 90%);
  max-height: 90%; */
`;

export const ModalContent = styled.div`
  background: var(--primary);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 500;
`;

export const CloseModal = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  position: absolute;
  top: 0;
  right: -35px;
  color: var(--white);
  font-weight: bold;
  font-size: 20px;
  outline: none;

  &:hover {
    background: #ffffff4d;
    cursor: pointer;
  }
`;
