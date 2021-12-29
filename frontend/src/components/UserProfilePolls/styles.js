import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    margin-bottom: 3rem;
  }
`;

export const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
`;

export const AlignLeftFilters = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px 10px 0;
`;

export const AlignRightFilters = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  > div button {
    background: var(--background-600);

    &:hover {
      background: var(--background-700);
    }
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
    border: 2px solid var(--background-600);
    border-radius: 5px;
    background: var(--background-600);
    outline: none;

    &:hover {
      border: 2px solid var(--gray);
    }
    &:focus {
      border: 2px solid var(--primary-400);
    }

    transition: border 0.3s;
  }
`;

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
  background: var(--background-400);
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const Label = styled.label`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: bold;
  margin-right: 15px;
`;

export const NotFound = styled.span`
  font-size: 1.8rem;
  font-weight: 500;
  font-style: italic;
  text-align: center;
  color: var(--dark-gray);
  padding: 5rem 0;
`;
