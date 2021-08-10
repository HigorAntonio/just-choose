import styled, { css } from 'styled-components';

import breakpoints from '../../styles/breakpoints';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: ${breakpoints.size2}) {
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
    margin-left: 15px;

    @media (max-width: ${breakpoints.size2}) {
      margin-left: 0;
      margin-top: 15px;
    }
  }

  @media (max-width: 399px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, auto);
  grid-gap: 15px;

  @media (max-width: 1586px) {
    grid-template-columns: repeat(3, auto);

    > div button {
      width: 100%;
      text-align: left;
    }
  }

  @media (max-width: 1246px) {
    grid-template-columns: repeat(2, auto);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, auto);
  }

  @media (max-width: 1046px) {
    grid-template-columns: repeat(2, auto);
  }

  @media (max-width: 665px) {
    grid-template-columns: 1fr;
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-self: flex-end;
  margin-left: 15px;

  > button + button {
    margin-left: 15px;
  }

  @media (max-width: 1586px) {
    align-self: flex-start;
  }

  @media (max-width: 850px) {
    margin-left: 0;
    margin-top: 15px;
  }
`;

export const LabelWrapper = styled.span`
  display: flex;
  align-items: center;

  @media (max-width: 1586px) {
    height: 31px;
    align-self: flex-start;
  }
`;

export const Label = styled.label`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: bold;
  margin-right: 15px;

  @media (max-width: 399px) {
    margin-right: 0;
    margin-bottom: 15px;
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

export const Providers = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  padding: 10px;

  @media (max-width: ${breakpoints.size3}) {
    grid-template-columns: 1fr;
  }
`;

export const Genres = styled.div`
  width: 400px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  padding: 10px;

  @media (max-width: ${breakpoints.size3}) {
    grid-template-columns: 1fr;
    width: 200px;
  }
`;

export const ReleaseDate = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 10px;

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
  padding: 10px;

  > div {
    display: flex;
    align-items: center;
    background: var(--background-400);
    padding: 0 10px;
    border-radius: 5px;

    > .label-left {
      margin-right: 20px;
    }

    > .label-right {
      margin-left: 20px;
    }
  }

  @media (max-width: 500px) {
    width: 200px;
  }
`;

export const Certification = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding: 10px;

  @media (max-width: ${breakpoints.size3}) {
    grid-template-columns: 1fr 1fr;
    width: 200px;
  }
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  height: 31px;
  padding: 10px;
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
