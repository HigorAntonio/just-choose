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

export const Filters = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 0.1px solid var(--search);

  > label {
    font-size: 14px;
    font-weight: bold;
    margin-right: 15px;
  }

  > div {
    margin-right: 15px;
  }
`;

export const Providers = styled.div`
  display: flex;
  flex-direction: column;

  > div + div {
    margin-top: 10px;
  }
`;

export const Genres = styled.div`
  width: 400px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`;

export const ReleaseDate = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  }

  > div + div {
    margin-top: 10px;
  }
`;

export const DataPickerWrapper = styled.div`
  width: 150px;
`;

export const RangeWrapper = styled.div`
  display: flex;
  align-items: center;
  background: var(--search);
  padding: 0 10px;
  border-radius: 5px;

  > .label-left {
    margin-right: 20px;
  }

  > .label-right {
    margin-left: 20px;
  }
`;

export const Certification = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
`;

export const SearchContent = styled.button`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--white);
  height: 35px;
  padding: 10px;
  border-radius: 5px;
  white-space: nowrap;
  outline: none;
  background: var(--accent);

  &:hover {
    background: #0f6ba8d9;
    cursor: pointer;
  }
`;
