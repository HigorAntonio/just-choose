import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const Title = styled.h3`
  font-size: 1.8rem;
`;

export const Main = styled.div`
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
