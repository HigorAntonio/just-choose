import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 30px 30px 10px 30px;

  > h1 {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const Navigation = styled.div`
  display: flex;
  margin: 0 30px;
  border-bottom: 1px solid var(--background-700);

  > div {
    display: flex;
    align-items: center;

    > a {
      text-decoration: none;
      margin: 5px 0;
    }

    &:hover,
    &.active {
      cursor: pointer;
      border-bottom: 2px solid var(--primary-400);

      > a {
        color: var(--primary-400);
        text-decoration: none;
      }
    }
  }

  > div + div {
    margin-left: 20px;
  }

  @media (max-width: 768px) {
    margin: 20px;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 20px 30px 30px 30px;

  > h3 {
    margin-bottom: 20px;
  }

  > div + h3 {
    margin-top: 40px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;
