import styled from 'styled-components';

export const Container = styled.div`
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
