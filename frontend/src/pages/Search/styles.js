import styled from 'styled-components';

export const Container = styled.div`
  margin: 3rem;
  padding-bottom: 5rem;

  @media (max-width: 768px) {
    margin: 2rem 1.5rem;
  }
`;

export const ResultsWrapper = styled.div`
  width: 100%;
  max-width: 128rem;
  margin: 0 auto;

  > div + div {
    margin-top: 2rem;
  }
`;
