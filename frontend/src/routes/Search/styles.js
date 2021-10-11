import styled from 'styled-components';

export const Container = styled.div`
  margin: 30px;
  padding-bottom: 50px;
`;

export const ResultsWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  > div + div {
    margin-top: 20px;
  }
`;
