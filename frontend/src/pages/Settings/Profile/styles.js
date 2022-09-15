import styled, { css } from 'styled-components';

const labelCss = css`
  flex-shrink: 0;
  font-size: 1.4rem;
  font-weight: bold;
  margin-right: 1.5rem;
`;

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

export const ProfileImageWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;

  > div.column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    > div.file-input {
      display: flex;

      > input[type='file'] {
        display: none;
      }

      > label {
        ${labelCss}
        padding: 0.7rem 2rem;
        background: var(--background-400);
        border-radius: 0.5rem;

        &:hover {
          background: var(--background-500);
          cursor: pointer;
        }
      }
    }

    > p {
      margin-top: 1rem;
      font-size: 1.4rem;
    }

    > p.thumb-error {
      width: 100%;
      color: var(--white);
      background: var(--error);
      padding: 0.7rem 2rem;
      border-radius: 0.5rem;
      font-size: 1.4rem;
      font-weight: bold;
    }
  }

  > div.button-wrapper {
    flex: 1;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ProfileImagePreview = styled.div`
  width: 9.6rem;
  background: var(--background-400);
  display: flex;
  margin-right: 2rem;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(1 * 100%);
  }

  &.rounded {
    border-radius: 50%;
  }

  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;

  @media (max-width: 640px) {
    margin-right: 0;
    margin-bottom: 2rem;
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

    > .error {
      color: var(--white);
      background: var(--error);
      padding: 0.7rem 2rem;
      border-radius: 0.5rem;
      font-size: 1.4rem;
      font-weight: bold;
      margin-top: 0.5rem;
    }
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

export const NameInput = styled.input`
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

  &:hover:not([disabled]) {
    border: 0.2rem solid var(--gray);
  }
  &:focus:not([disabled]) {
    border: 0.2rem solid var(--primary-400);
  }
  &:disabled {
    background: var(--background-300);
    border: 0.2rem solid var(--background-300);
    color: var(--dark-gray);
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

export const ProfileButton = styled.button`
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

  & ${InputWrapper} + ${InputWrapper} {
    border-top: 0.01rem solid var(--background-600);
  }

  @media (max-width: 1130px) {
    width: 100%;
  }
`;

export const Hint = styled.p`
  margin-top: 1rem;
  font-size: 1.4rem;
`;

export const AboutTextArea = styled.textarea`
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
`;
