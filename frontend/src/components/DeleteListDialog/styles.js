import styled from 'styled-components';

export const Container = styled.div`
  width: 500px;
  max-width: calc(95vw - 40px);
`;

export const Header = styled.div`
  background: var(--background-100);
  font-size: 10px;
  padding: 20px;
  position: relative;
  border-radius: 5px 5px 0 0;
  z-index: 5000;

  -webkit-box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
`;

export const Main = styled.div`
  background: var(--background-100);
  padding: 20px;
  border-radius: 0 0 5px 5px;

  > div + div {
    margin-top: 20px;
  }

  > input {
    width: 100%;
    background: var(--background-400);
    padding: 5px 10px;
    border: 2px solid var(--background-400);
    border-radius: 5px;
    outline: none;
    margin-top: 20px;

    &:hover {
      border: 2px solid var(--gray);
    }
    &:focus {
      border: 2px solid var(--error);
    }

    transition: border 0.3s;
  }

  > button {
    margin-top: 20px;
    width: 100%;
    padding: 7px;
    border-radius: 5px;
    background: var(--background-400);
    outline: none;
    font-weight: bold;
    font-size: 16px;

    &:hover {
      cursor: pointer;
      color: var(--white);
      background: var(--error);
    }

    &:disabled {
      cursor: not-allowed;
      background: var(--background-300);
      color: var(--dark-gray);
    }
  }
`;
