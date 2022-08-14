import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Input = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  background: var(--background-400);
  ${(props) =>
    props.validationError
      ? `border: 0.2rem solid var(--error);`
      : `border: 0.2rem solid var(--background-400);`}

  &:hover {
    border: 0.2rem solid var(--gray);
  }
  &:focus-within {
    border: 0.2rem solid var(--primary-400);
  }

  transition: border 0.3s;

  > input {
    flex: 2;
    order: 1;
    font-size: 1.4rem;
    width: 100%;
    height: 100%;
    max-width: 68rem;
    padding: 0.5rem 3.7rem 0.5rem 1rem;
    background: var(--background-400);
    outline: none;
    border-radius: 0.5rem 0 0 0.5rem;
  }

  > label {
    height: 100%;
    order: 2;
    display: flex;
    align-items: center;
    background: var(--background-400);
    padding-right: 0.2rem;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  @media (max-width: 1027px) {
    max-width: 100%;
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
