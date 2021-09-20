import styled, { css } from 'styled-components';

const labelCss = css`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: bold;
  margin-right: 15px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > h3 {
    margin-bottom: 20px;
  }

  > div + h3 {
    margin-top: 40px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const LayoutBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 900px;
  background: var(--background-100);
  border: 0.1px solid var(--background-600);
  border-radius: 5px;

  > div {
    padding: 20px;
  }

  > div + div {
    border-top: 1px solid var(--background-600);
  }

  @media (max-width: 1130px) {
    width: 100%;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  padding: 20px;

  > .column {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 680px;

    > .row {
      display: flex;
      justify-content: space-between;
    }

    > .error {
      color: var(--white);
      background: var(--error);
      padding: 7px 20px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: bold;
      margin-top: 5px;
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
    font-size: 14px;
    width: 100%;
    max-width: 680px;
    max-height: 50px;
    resize: none;
    padding: 5px 10px;
    border: 2px solid var(--background-400);
    border-radius: 5px;
    background: var(--background-400);
    outline: none;

    &:hover {
      border: 2px solid var(--gray);
    }
    &:focus {
      border: 2px solid var(--primary-400);
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
  width: 180px;

  > label {
    font-size: 14px;
    font-weight: bold;
  }

  @media (max-width: 1027px) {
    margin-bottom: 15px;
  }
`;

export const Input = styled.input`
  font-size: 14px;
  width: 100%;
  max-width: 680px;
  padding: 5px 10px;
  border-radius: 5px;
  background: var(--background-400);
  outline: none;
  ${(props) =>
    props.validationError
      ? `border: 2px solid var(--error);`
      : `border: 2px solid var(--background-400);`}

  &:hover {
    border: 2px solid var(--gray);
  }
  &:focus {
    border: 2px solid var(--primary-400);
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
  font-size: 14px;
  height: 31px;
  padding: 10px;
  border-radius: 5px;
  white-space: nowrap;
  outline: none;
  color: ${(props) => (props.disabled ? `var(--gray)` : `var(--white)`)};
  background: ${(props) =>
    props.disabled ? `var(--background-500)` : `var(--primary-400)`};

  &:hover {
    cursor: ${(props) => (props.disabled ? `not-allowed` : `pointer`)};
  }
`;

export const Email = styled.p`
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: bold;
`;

export const EmailStatus = styled.p`
  font-size: 1.4rem;
  margin-top: 10px;

  > span {
    font-weight: bold;
  }
`;

export const ResendEmailButton = styled.button`
  font-size: 1.4rem;
  font-weight: bold;
  background: var(--background-400);
  padding: 5px 8px;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;
