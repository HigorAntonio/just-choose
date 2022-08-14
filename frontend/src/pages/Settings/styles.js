import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--background-410);
`;

export const StickyWrapper = styled.div`
  width: 100%;
  background: var(--background-410);
  position: sticky;
  top: 0;
  padding: 3rem 3rem 0 3rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem 0 1.5rem;
  }
`;

export const Header = styled.header`
  > h1 {
    font-size: 3.6rem;
  }
`;

export const NavigationWrapper = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
  border-bottom: 0.1rem solid var(--background-700);
`;

export const Navigation = styled.div`
  height: 100%;
  display: flex;

  > div {
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 400;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;

    &:hover,
    &.active {
      cursor: pointer;
      color: var(--primary-400);
      text-decoration: none;
    }

    &.active {
      border-bottom: 0.2rem solid var(--primary-400);
    }
  }

  > div + div {
    margin-left: 2rem;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 2rem 3rem 3rem 3rem;

  > h3 {
    margin-bottom: 2rem;
  }

  > div + h3 {
    margin-top: 4rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;
