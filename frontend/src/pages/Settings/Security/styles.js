import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > h3 {
    margin-bottom: 2rem;
  }

  > div + h3 {
    margin-top: 4rem;
  }
`;

export const LayoutBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 90rem;
  background: var(--background-100);
  border: 0.01rem solid var(--background-600);
  border-radius: 0.5rem;

  > div {
    padding: 2rem;
  }

  > div + div {
    border-top: 0.1rem solid var(--background-600);
  }

  @media (max-width: 1130px) {
    width: 100%;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  padding: 2rem;

  > .column {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 68rem;

    > .row {
      display: flex;
      justify-content: space-between;
    }

    > .error {
      color: var(--white);
      background: var(--error);
      padding: 0.7rem 2rem;
      border-radius: 0.5rem;
      font-size: 1.4rem;
      font-weight: bold;
      margin-top: 0.5rem;
    }

    > span {
      p,
      button {
        font-size: 1.4rem;
      }

      p {
        display: inline;
      }

      button {
        color: var(--primary-400);

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  > textarea {
    font-size: 1.4rem;
    width: 100%;
    max-width: 68rem;
    max-height: 5rem;
    resize: none;
    padding: 0.5rem 1rem;
    border: 0.2rem solid var(--background-400);
    border-radius: 0.5rem;
    background: var(--background-400);
    outline: none;

    &:hover {
      border: 0.2rem solid var(--gray);
    }
    &:focus {
      border: 0.2rem solid var(--primary-400);
    }

    transition: border 0.3s;
  }

  @media (max-width: 1027px) {
    flex-direction: column;

    > .column,
    textarea {
      max-width: 100%;
    }
  }
`;

export const LabelWrapper = styled.div`
  display: inline-block;
  width: 18rem;

  > label {
    font-size: 1.4rem;
    font-weight: bold;
  }

  @media (max-width: 1027px) {
    margin-bottom: 1.5rem;
  }
`;

export const Input = styled.input`
  font-size: 1.4rem;
  width: 100%;
  max-width: 68rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--background-400);
  outline: none;
  ${(props) =>
    props.validationError
      ? `border: 0.2rem solid var(--error);`
      : `border: 0.2rem solid var(--background-400);`}

  &:hover {
    border: 0.2rem solid var(--gray);
  }
  &:focus {
    border: 0.2rem solid var(--primary-400);
  }

  transition: border 0.3s;

  @media (max-width: 1027px) {
    max-width: 100%;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  background: var(--background-600);
`;

export const ChangePasswordButton = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.4rem;
  height: 3.1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  white-space: nowrap;
  outline: none;
  color: ${(props) => (props.disabled ? `var(--gray)` : `var(--white)`)};
  background: ${(props) =>
    props.disabled ? `var(--background-500)` : `var(--primary-400)`};

  &:hover {
    cursor: ${(props) => (props.disabled ? `not-allowed` : `pointer`)};
  }
`;

export const EmailWrapper = styled.span`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
`;

export const Email = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmailStatus = styled.p`
  font-size: 1.4rem;
  margin-top: 1rem;

  > span {
    font-weight: bold;
  }
`;

export const ResendEmailButton = styled.button`
  font-size: 1.4rem;
  font-weight: bold;
  background: var(--background-400);
  padding: 0.5rem 0.8rem;
  margin-left: 2rem;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;
