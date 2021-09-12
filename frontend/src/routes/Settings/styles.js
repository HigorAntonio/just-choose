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
  padding: 30px 30px 10px 30px;

  > h1 {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const Navigation = styled.div`
  display: flex;
  margin: 0 30px;
  border-bottom: 1px solid var(--background-700);

  > div {
    &:hover,
    &.active {
      cursor: pointer;
      border-bottom: 2px solid var(--primary-400);

      > p {
        color: var(--primary-400);
      }
    }
  }

  > div + div {
    margin-left: 20px;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 20px 30px 30px 30px;

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

  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;

  @media (max-width: 640px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;
