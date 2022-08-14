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
`;

export const Header = styled.header`
  padding: 3rem;

  > h1 {
    font-size: 3.6rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
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

export const TitleInput = styled.input`
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

export const ThumbnailWrapper = styled.div`
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

export const ThumbPreview = styled.div`
  width: 17rem;
  background: var(--background-400);
  display: flex;
  margin-right: 2rem;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(9 / 16 * 100%);
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

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 3rem 3rem 3rem;

  > h3 {
    margin-bottom: 2rem;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 90rem;
    background: var(--background-100);
    border: 0.01px solid var(--background-600);
    border-radius: 0.5rem;

    @media (max-width: 1130px) {
      width: 100%;
    }
  }

  > div + h3 {
    margin-top: 4rem;
  }

  > .content-list {
    width: 100%;
    min-width: 100%;
  }

  & ${InputWrapper} + ${InputWrapper} {
    border-top: 0.01rem solid var(--background-600);
  }

  > .error {
    color: var(--white);
    background: var(--error);
    padding: 0.7rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 0 1.5rem 2rem 1.5rem;
  }
`;

export const LabelWrapper = styled.div`
  display: inline-block;
  width: 18rem;
  padding-right: 2rem;

  > label {
    font-size: 1.4rem;
    font-weight: bold;
  }

  @media (max-width: 1027px) {
    margin-bottom: 1.5rem;
  }
`;

export const ContentListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Options = styled.div`
  ${(props) => props.width && `width: ${props.width};`};
  display: flex;
  flex-direction: column;

  > div + div {
    margin-top: 1rem;
  }
`;

export const Option = styled.div`
  width: 100%;
  background: var(--background-400);
  padding: 1rem;
  border-radius: 0.5rem;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const SharingOption = styled.div`
  display: flex;
  flex-direction: column;

  > div + div {
    font-size: 1.3rem;
  }
`;

export const ContentListWrapper = styled.div`
  max-height: 55rem;
  overflow-y: auto;

  /* Scrollbar on Firefox */
  scrollbar-color: var(--dark-gray) var(--background-100);

  /* Scrollbar on Chrome, Edge, and Safari */
  &::-webkit-scrollbar-track {
    background: var(--background-100);
  }

  > div {
    padding: 2rem;
  }
`;

export const CreationOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 2rem;
  border-top: 0.01rem solid var(--background-600);

  > div {
    display: flex;
    > button + button {
      margin-left: 1.5rem;
    }
  }

  @media (max-width: 415px) {
    flex-direction: column;

    > div + div {
      margin-top: 1.5rem;
    }
  }
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.4rem;
  color: var(--white);
  height: 3.1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  white-space: nowrap;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`;

export const CreateButton = styled.button`
  ${buttonCss}
  color: var(--white);
  background: var(--primary-400);

  &:hover {
    background: var(--primary-500);
  }
`;
