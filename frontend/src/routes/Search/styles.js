import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;

export const FiltersLeft = styled.div`
  display: flex;
  align-items: center;

  > div {
    font-size: 18px;
    font-weight: bold;
    padding: 5px 0;

    &.active {
      color: var(--primary-400);
      border-bottom: 2px solid var(--primary-400);
    }

    &:hover {
      cursor: pointer;
    }
  }

  > div + div {
    margin-left: 20px;
  }
`;

export const FiltersRight = styled.div`
  display: flex;
  align-items: center;

  > label {
    font-size: 14px;
    font-weight: bold;
    margin-right: 15px;
  }
`;

export const SortOptions = styled.div`
  width: 175px;
  display: flex;
  align-items: center;
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

export const Main = styled.div`
  padding: 0 30px 30px 30px;
`;

export const SearchItems = styled.div`
  width: 90%;
  max-width: 900px;

  > div + div {
    margin-top: 15px;
  }
`;

export const SearchItem = styled.div`
  &:hover {
    cursor: pointer;
  }
`;
