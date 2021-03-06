import styled from 'styled-components';

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

  > input,
  textarea {
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

  > input[type='file'] {
    display: none;
  }

  > label {
    flex-shrink: 0;
    font-size: 14px;
    font-weight: bold;
    padding: 7px 20px;
    background: var(--search);
    border-radius: 5px;
    margin-right: 15px;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      cursor: pointer;
    }
  }

  > p {
    font-size: 14px;
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

export const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;
`;

export const ContentListHeader = styled.div`
  height: 76px;
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 0.1px solid var(--search);

  > label {
    flex-shrink: 0;
    font-size: 14px;
    font-weight: bold;
    margin-right: 15px;
  }

  > div + div {
    margin-left: 15px;
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
  background: var(--search);
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }
`;
