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
`;

export const Header = styled.header`
  padding: 30px 30px 30px;

  > h1 {
    font-size: 36px;
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

export const TitleInput = styled.input`
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
  width: 170px;
  background: var(--background-400);
  display: flex;
  margin-right: 20px;

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(9 / 16 * 100%);
  }

  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;

  @media (max-width: 640px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 30px;

  > h3 {
    margin-bottom: 20px;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 900px;
    background: var(--background-100);
    border: 0.1px solid var(--background-600);
    border-radius: 5px;
    margin-bottom: 40px;

    @media (max-width: 1130px) {
      width: 100%;
    }
  }

  > .content-list {
    width: 100%;
    min-width: 100%;
  }

  & ${InputWrapper} + ${InputWrapper} {
    border-top: 0.1px solid var(--background-600);
  }

  > .error {
    color: var(--white);
    background: var(--error);
    padding: 7px 20px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  @media (max-width: 500px) {
    padding: 0 20px;
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

export const ContentListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentListHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > label {
      ${labelCss}

      @media (max-width: 399px) {
        margin-right: 0;
        margin-bottom: 15px;
      }
    }

    /* > div {
      display: flex;
      align-items: center;
      flex-shrink: 0;

      > div {
        display: flex;
        align-items: center;
      }

      > div + div,
      button + button {
        margin-left: 15px;
      }

      > label {
        ${labelCss}
      }
    }

    > div + div {
      margin-left: 15px;
    } */

    @media (max-width: 775px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  > .wrapper + .wrapper {
    margin-top: 15px;
  }

  .content-type-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;

    @media (max-width: 399px) {
      flex-direction: column;
    }
  }
`;

export const Options = styled.div`
  ${(props) => props.width && `width: ${props.width};`};
  display: flex;
  flex-direction: column;

  > div + div {
    margin-top: 10px;
  }
`;

export const Option = styled.div`
  width: 100%;
  background: var(--background-400);
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const SharingOption = styled.div`
  display: flex;
  flex-direction: column;

  > div + div {
    font-size: 13px;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 15px;
  position: relative;

  > svg {
    position: absolute;
    left: 8.5px;
  }

  > input {
    font-size: 14px;
    width: 350px;
    padding: 5px 10px 5px 30px;
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

    @media (max-width: 775px) {
      width: 100%;
    }
  }

  @media (max-width: 775px) {
    width: 100%;
    order: -1;
    margin-left: 0;
    margin-bottom: 15px;
  }
`;

export const ContentListWrapper = styled.div`
  max-height: 550px;
  border-top: 0.1px solid var(--background-600);
  overflow-y: scroll;

  /* Scrollbar on Firefox */
  scrollbar-color: var(--dark-gray) var(--background-100);

  /* Scrollbar on Chrome, Edge, and Safari */
  &::-webkit-scrollbar-track {
    background: var(--background-100);
  }
`;

export const CreationOptions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-top: 0.1px solid var(--background-600);

  > div {
    display: flex;
    > button + button {
      margin-left: 15px;
    }
  }

  @media (max-width: 415px) {
    flex-direction: column;

    > div + div {
      margin-top: 15px;
    }
  }
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  height: 31px;
  padding: 10px;
  border-radius: 5px;
  white-space: nowrap;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`;

export const ClearButton = styled.button`
  ${buttonCss}
  background: var(--background-400);

  &:hover {
    background: var(--background-500);
  }
`;

export const PreviewButton = styled.button`
  ${buttonCss}
  background: var(--background-400);

  &:hover {
    background: var(--background-500);
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
