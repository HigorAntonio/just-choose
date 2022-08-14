import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 128rem;
  margin: 0 auto;

  > div + div {
    margin-top: 2rem;
  }
`;

export const Header = styled.div``;

export const Title = styled.div`
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

export const Main = styled.div`
  > div {
    margin-bottom: 2rem;
  }
`;
