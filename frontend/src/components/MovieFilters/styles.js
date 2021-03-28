import styled, { css } from 'styled-components';

export const OrderByOptions = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
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

export const Providers = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
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
`;

export const SearchButton = styled.button`
  ${buttonCss}
  background: var(--accent);

  &:hover {
    background: #0f6ba8d9;
    cursor: pointer;
  }
`;

export const ClearButton = styled.button`
  ${buttonCss}
  background: var(--search-button);

  &:hover {
    background: var(--search);
    cursor: pointer;
  }
`;
