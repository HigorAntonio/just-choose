import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  flex-shrink: 0;
  font-size: 1.4rem;
  font-weight: bold;
  margin-right: 1.5rem;
  align-self: center;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > ${Label} {
    @media (max-width: 399px) {
      margin-right: 0;
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 775px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ContentTypeWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;

  @media (max-width: 399px) {
    flex-direction: column;
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  > ${Wrapper} + ${Wrapper} {
    margin-top: 1.5rem;
  }
`;

export const Options = styled.div`
  ${(props) => props.minWidth && `min-width: ${props.minWidth};`};
  display: flex;
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

  &:hover,
  &:focus {
    background: var(--background-500);
    cursor: pointer;
  }

  &:focus {
    outline: 0.2rem solid var(--primary-400);
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
  margin-left: 1.5rem;

  @media (max-width: 775px) {
    width: 100%;
    order: -1;
    margin-left: 0;
    margin-bottom: 1.5rem;
  }
`;

export const SearchInput = styled.div`
  width: 100%;
  max-width: 35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  > svg {
    position: absolute;
    left: 0.85rem;
  }

  > input {
    width: 100%;
    font-size: 1.4rem;
    padding: 0.5rem 1rem 0.5rem 3rem;
    border: 0.2rem solid var(--background-400);
    border-radius: 0.5rem;
    background: var(--background-400);
    outline: none;

    &:hover {
      border: 0.2rem solid var(--gray);
    }
    &:focus {
      border: 0.2rem solid var(--primary-400);
    }

    transition: border 0.3s;

    @media (max-width: 775px) {
      width: 100%;
    }
  }

  @media (max-width: 775px) {
    max-width: 100%;
  }
`;

export const ContentListWrapper = styled.div`
  max-height: 55rem;
  border-top: 0.01rem solid var(--background-600);
  overflow-y: scroll;

  /* Scrollbar on Firefox */
  scrollbar-color: var(--dark-gray) var(--background-100);

  /* Scrollbar on Chrome, Edge, and Safari */
  &::-webkit-scrollbar-track {
    background: var(--background-100);
  }
`;
