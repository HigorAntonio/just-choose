import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0 20px 0;
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;
  border-bottom: 1px solid var(--background-700);

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: flex-start;

    > div + div {
      margin-top: 20px;
    }
  }
`;

export const FiltersLeft = styled.div`
  display: flex;
  align-items: center;

  > div {
    font-size: 18px;
    font-weight: 500;
    padding: 5px 0;

    &.active {
      color: var(--primary-400);
      border-bottom: 2px solid var(--primary-400);

      > a {
        color: var(--primary-400);
      }
    }

    &:hover {
      cursor: pointer;
    }

    > a {
      text-decoration: none;
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

export const Main = styled.div``;

export const SearchItems = styled.div`
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 0 0 0;

  > div + div {
    margin-top: 15px;
  }
`;

export const SearchItem = styled.div`
  &:hover {
    cursor: pointer;
  }
`;
