import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Input = styled.div`
  > input {
    width: 100%;
    background: var(--background-500);
    padding: 0.5rem 3.7rem 0.5rem 1rem;
    border: 0.2rem solid var(--background-500);
    border-radius: 0.5rem;
    outline: none;

    &:hover {
      border: 0.2rem solid var(--background-900);
    }
    &:focus {
      border: 0.2rem solid var(--primary-400);
    }

    transition: border 0.3s;
  }

  > label {
    margin-bottom: 0.5rem;
    font-weight: bold;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const ToggleVisibility = styled.span`
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.2rem;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;
