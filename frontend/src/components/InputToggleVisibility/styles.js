import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Input = styled.div`
  > input {
    width: 100%;
    background: var(--background-500);
    padding: 5px 37px 5px 10px;
    border: 2px solid var(--background-500);
    border-radius: 5px;
    outline: none;

    &:hover {
      border: 2px solid var(--background-900);
    }
    &:focus {
      border: 2px solid var(--primary-400);
    }

    transition: border 0.3s;
  }

  > label {
    margin-bottom: 5px;
    font-weight: bold;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const ToggleVisibility = styled.span`
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;
