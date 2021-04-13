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

export const StatusAlert = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%);
  z-index: 1000;
  ${(props) =>
    props.status === 'creating'
      ? `background: var(--accent);`
      : props.status === 'error'
      ? `background: var(--warning);`
      : `background: var(--success);`}
  ${(props) =>
    props.show
      ? `opacity: 1;
        pointer-events: all;
        transform: translateY(0);`
      : `opacity: 0;
        pointer-events: none;
        max-height: 0;
        padding: 0;
        transform: translateY(-50%);`}
  transition: opacity 0.4s ease, transform 0.4s ease;

  > p {
    font-size: 16px;
    font-weight: bold;
  }
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

  > input,
  textarea {
    font-size: 14px;
    width: 100%;
    max-width: 680px;
    padding: 5px 10px;
    border: 2px solid var(--search);
    border-radius: 5px;
    background: var(--search);
    outline: none;

    &:hover {
      border: 2px solid var(--gray);
    }
    &:focus {
      border: 2px solid var(--accent);
    }

    transition: border 0.3s;
  }

  > textarea {
    max-height: 50px;
    resize: none;
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
        background: var(--search);
        border-radius: 5px;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          cursor: pointer;
        }
      }
    }

    > p {
      margin-top: 10px;
      font-size: 14px;
    }

    > p.thumb-error {
      background: var(--warning);
      padding: 7px 20px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: bold;
    }
  }
`;

export const ThumbPreview = styled.div`
  width: 170px;
  background: var(--search-button);
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
    background: var(--nav-bar);
    border: 0.1px solid var(--search);
    border-radius: 5px;
    margin-bottom: 40px;
  }

  > .content-list {
    width: 100%;
    max-width: 100%;
  }

  & ${InputWrapper} + ${InputWrapper} {
    border-top: 0.1px solid var(--search);
  }
`;

export const LabelWrapper = styled.div`
  display: inline-block;
  width: 180px;

  > label {
    font-size: 14px;
    font-weight: bold;
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

  > .row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
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
    }
  }

  > .row + .row {
    margin-top: 15px;
  }
`;

export const ContentTypes = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;

  > div + div {
    margin-top: 10px;
  }
`;

export const Option = styled.div`
  width: 100%;
  background: var(--search);
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  > svg {
    position: absolute;
    left: 8.5px;
  }

  > input {
    font-size: 14px;
    width: 350px;
    padding: 5px 10px 5px 30px;
    border: 2px solid var(--search);
    border-radius: 5px;
    background: var(--search);
    outline: none;

    &:hover {
      border: 2px solid var(--gray);
    }
    &:focus {
      border: 2px solid var(--accent);
    }

    &::placeholder {
      color: var(--white);
    }

    transition: border 0.3s;
  }

  > div label {
    ${labelCss}
  }
`;

export const ContentListWrapper = styled.div`
  max-height: 550px;
  overflow-y: auto;
  border-top: 0.1px solid var(--search);
`;

export const CreationOptions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-top: 0.1px solid var(--search);

  > div {
    display: flex;
    > button + button {
      margin-left: 15px;
    }
  }
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  color: var(--white);
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
  background: var(--search-button);

  &:hover {
    background: var(--search);
  }
`;

export const PreviewButton = styled.button`
  ${buttonCss}
  background: var(--search);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

export const CreateButton = styled.button`
  ${buttonCss}
  background: var(--accent);

  &:hover {
    background: #0f6ba8d9;
  }
`;
