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
  z-index: 3000;
`;

export const ModalWrapper = styled.div`
  /* width: min(42rem, 90%); */
  max-height: 100%;
  padding: 2rem 0 2rem 0;

  &::after {
    content: '';
    display: block;
    height: 2rem;
  }
`;

export const ModalContent = styled.div`
  background: var(--primary);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transform: translateX(-1rem);
  z-index: 4000;
`;

export const CloseModal = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  position: absolute;
  top: 0;
  right: -3.5rem;
  color: var(--white);
  font-weight: bold;
  font-size: 2rem;
  outline: none;

  &:hover {
    background: #ffffff4d;
    cursor: pointer;
  }
`;
