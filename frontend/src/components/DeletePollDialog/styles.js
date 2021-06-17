import styled from 'styled-components';

export const Container = styled.div`
  width: 500px;
  max-width: 90vw;
`;

export const Header = styled.div`
  background: var(--primary);
  font-size: 10px;
  padding: 20px;
`;

export const Main = styled.div`
  background: var(--secondary);
  padding: 20px;

  > div + div {
    margin-top: 20px;
  }

  > input {
    width: 100%;
    background: var(--search);
    padding: 5px 10px;
    border: 2px solid var(--search);
    border-radius: 5px;
    outline: none;
    margin-top: 20px;

    &:hover {
      border: 2px solid var(--gray);
    }
    &:focus {
      border: 2px solid var(--warning);
    }

    transition: border 0.3s;
  }

  > button {
    margin-top: 20px;
    width: 100%;
    padding: 7px;
    border-radius: 5px;
    background: var(--search-button);
    outline: none;
    font-weight: bold;
    font-size: 16px;

    &:hover {
      cursor: pointer;
      background: var(--warning);
    }

    &:disabled {
      cursor: not-allowed;
      background: rgba(256, 256, 256, 0.08);
      color: #888;
    }
  }
`;
