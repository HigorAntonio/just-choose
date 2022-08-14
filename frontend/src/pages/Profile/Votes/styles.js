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
  padding-bottom: 1rem;

  @media (max-width: 880px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const AlignLeftFilters = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 0 1rem 1rem 0;

  @media (max-width: 880px) {
    width: 100%;
  }
`;

export const AlignRightFilters = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin-bottom: 1rem;

  > div button {
    background: var(--background-600);

    &:hover {
      background: var(--background-700);
    }
  }

  @media (max-width: 324px) {
    flex-direction: column;
    align-items: flex-start;

    > label {
      margin-bottom: 0.5rem;
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
    left: 0.85rem;
  }

  > input {
    font-size: 1.4rem;
    width: 35rem;
    padding: 0.5rem 1rem 0.5rem 3rem;
    border: 0.2rem solid var(--background-600);
    border-radius: 0.5rem;
    background: var(--background-600);
    outline: none;

    &:hover {
      border: 0.2rem solid var(--gray);
    }
    &:focus {
      border: 0.2rem solid var(--primary-400);
    }

    transition: border 0.3s;

    @media (max-width: 880px) {
      width: 100%;
      max-width: 35rem;
    }
  }

  @media (max-width: 880px) {
    width: 100%;
  }
`;

export const OrderByOptions = styled.div`
  width: 20rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  > div + div {
    margin-top: 1rem;
  }
`;

export const Option = styled.div`
  width: 100%;
  background: var(--background-400);
  padding: 1rem;
  border-radius: 0.5rem;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const Label = styled.label`
  flex-shrink: 0;
  font-size: 1.4rem;
  font-weight: bold;
  margin-right: 1.5rem;
`;

export const NotFound = styled.span`
  font-size: 1.8rem;
  font-weight: 500;
  font-style: italic;
  text-align: center;
  color: var(--dark-gray);
  padding: 5rem 0;
`;
