import styled, { css } from 'styled-components';

import breakpoints from '../../styles/breakpoints';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: ${breakpoints.size5}) {
    flex-direction: column;
  }
`;

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;

  &.space-beetween {
    justify-content: space-between;

    @media (max-width: 850px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &.filter-grid-wrapper {
    @media (max-width: 850px) {
      flex: 2;
    }
  }

  & + & {
    margin-left: 1.5rem;

    @media (max-width: ${breakpoints.size5}) {
      margin-left: 0;
      margin-top: 1.5rem;
    }
  }

  @media (max-width: 399px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-gap: 1.5rem;

  @media (max-width: 980px) {
    grid-template-columns: repeat(3, auto);

    > div button {
      width: 100%;
      text-align: left;
    }
  }

  @media (max-width: 854px) {
    grid-template-columns: repeat(2, auto);
  }

  @media (max-width: 667px) {
    grid-template-columns: repeat(1, auto);
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-self: flex-end;
  margin-left: 1.5rem;

  > button + button {
    margin-left: 1.5rem;
  }

  @media (max-width: 1586px) {
    align-self: flex-start;
  }

  @media (max-width: 850px) {
    margin-left: 0;
    margin-top: 1.5rem;
  }
`;

export const LabelWrapper = styled.span`
  display: flex;
  align-items: center;

  @media (max-width: 1586px) {
    height: 3.1rem;
    align-self: flex-start;
  }
`;

export const Label = styled.label`
  flex-shrink: 0;
  font-size: 1.4rem;
  font-weight: bold;
  margin-right: 1.5rem;

  @media (max-width: 399px) {
    margin-right: 0;
    margin-bottom: 1.5rem;
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
  border-radius: 5px;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const Platforms = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  overflow-y: scroll;

  &::after {
    content: '';
    display: block;
    height: 0.1px;
  }

  @media (max-width: 1230px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

export const Genres = styled.div`
  width: 40rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;

  @media (max-width: ${breakpoints.size3}) {
    grid-template-columns: 1fr;
    width: 20rem;
  }
`;

export const ReleaseDate = styled.div`
  width: 20rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  }

  > div + div {
    margin-top: 1rem;
  }
`;

export const DataPickerWrapper = styled.div`
  width: 15rem;
`;

export const RangeWrapper = styled.div`
  padding: 1rem;

  > div {
    display: flex;
    align-items: center;
    background: var(--background-400);
    padding: 0 1rem;
    border-radius: 5px;

    > .label-left {
      margin-right: 2rem;
    }

    > .label-right {
      margin-left: 2rem;
    }
  }

  @media (max-width: 500px) {
    width: 20rem;
  }
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.4rem;
  height: 3.1rem;
  padding: 1rem;
  border-radius: 5px;
  white-space: nowrap;
  outline: none;
`;

export const SearchButton = styled.button`
  ${buttonCss}
  color: var(--white);
  background: var(--primary-400);

  &:hover {
    background: var(--primary-500);
    cursor: pointer;
  }
`;

export const ClearButton = styled.button`
  ${buttonCss}
  background: var(--background-400);

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;
