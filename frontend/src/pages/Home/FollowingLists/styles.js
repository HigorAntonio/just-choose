import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-width: 100%;
  margin-bottom: 1rem;

  > div {
    flex: 1;
    padding: 0 0.5rem;
  }

  > div:first-of-type {
    padding: 0 0.5rem 0 0;
  }

  > div:last-of-type {
    padding: 0 0 0 0.5rem;
  }

  > div:only-child {
    padding: 0;
  }
`;
