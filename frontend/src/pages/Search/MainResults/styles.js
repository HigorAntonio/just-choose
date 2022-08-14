import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 128rem;
  margin: 0 auto;

  > div + div {
    margin-top: 2rem;
  }
`;
