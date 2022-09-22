import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 50rem;
  max-width: calc(95vw - 4rem);
  word-break: break-word;
`;

export const Header = styled.div`
  background: var(--background-100);
  font-size: 1rem;
  padding: 2rem;
  position: relative;
  border-radius: 0.5rem 0.5rem 0 0;
  z-index: 5000;

  -webkit-box-shadow: 0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.5);
`;

export const Main = styled.div`
  background: var(--background-100);
  padding: 2rem;
  border-radius: 0 0 0.5rem 0.5rem;

  > div + div {
    margin-top: 2rem;
  }

  > input {
    width: 100%;
    background: var(--background-400);
    padding: 0.5rem 1rem;
    border: 0.2rem solid var(--background-400);
    border-radius: 0.5rem;
    outline: none;
    margin-top: 2rem;

    &:hover {
      border: 0.2rem solid var(--gray);
    }
    &:focus {
      border: 0.2rem solid var(--error);
    }

    transition: border 0.3s;
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  > button + button {
    margin-left: 1.5rem;
  }

  @media (max-width: 440px) {
    flex-direction: column;
    justify-content: flex-start;

    > button + button {
      margin: 0;
      margin-top: 1.5rem;
    }
  }
`;

const buttonCss = css`
  padding: 0.7rem;
  border-radius: 0.5rem;
  background: var(--background-400);
  outline: none;
  font-weight: bold;
  font-size: 1.6rem;

  &:hover {
    cursor: pointer;
  }
`;

export const CancelButton = styled.button`
  ${buttonCss}
  background: var(--background-400);

  &:hover,
  &:focus {
    background: var(--background-500);
  }

  &:focus {
    outline: 0.2rem solid var(--primary-400);
  }
`;

export const ConfirmButton = styled.button`
  ${buttonCss}
  color: var(--white);
  background: var(--primary-400);

  &:hover,
  &:focus {
    background: var(--primary-500);
  }

  &:focus {
    outline: 0.2rem solid var(--primary-400);
  }
`;
