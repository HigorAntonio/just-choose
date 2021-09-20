import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Input = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background: var(--background-400);
  ${(props) =>
    props.validationError
      ? `border: 2px solid var(--error);`
      : `border: 2px solid var(--background-400);`}

  &:hover {
    border: 2px solid var(--gray);
  }
  &:focus-within {
    border: 2px solid var(--primary-400);
  }

  transition: border 0.3s;

  > input {
    flex: 2;
    order: 1;
    font-size: 14px;
    width: 100%;
    height: 100%;
    max-width: 680px;
    padding: 5px 37px 5px 10px;
    background: var(--background-400);
    outline: none;
    border-radius: 5px 0 0 5px;
  }

  > label {
    height: 100%;
    order: 2;
    display: flex;
    align-items: center;
    background: var(--background-400);
    padding-right: 2px;
    border-radius: 0 5px 5px 0;
  }

  @media (max-width: 1027px) {
    max-width: 100%;
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
