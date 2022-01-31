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

  @media (max-width: 1130px) {
    width: 100%;
  }
`;

export const ThumbnailWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;

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
        padding: 7px 20px;
        background: var(--background-400);
        border-radius: 5px;

        &:hover {
          background: var(--background-500);
          cursor: pointer;
        }
      }
    }

    > p {
      margin-top: 10px;
      font-size: 14px;
    }

    > p.thumb-error {
      width: 100%;
      color: var(--white);
      background: var(--error);
      padding: 7px 20px;
      border-radius: 5px;
      font-size: 14px;
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

export const ThumbPreview = styled.div`
  width: 96px;
  background: var(--background-400);
  display: flex;
  margin-right: 20px;

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
    margin-bottom: 20px;
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

    > .error {
      color: var(--white);
      background: var(--error);
      padding: 7px 20px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: bold;
      margin-top: 5px;
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

export const NameInput = styled.input`
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

export const ProfileButton = styled.button`
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
